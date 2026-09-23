import secrets
import string
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

from db.database import get_db
from models.referral_model import Referral, ReferralSignup
from utils.logger import logger

router = APIRouter(prefix="/referral", tags=["referral"])


class GetOrCreateCodeRequest(BaseModel):
    emp_id: str
    name: str = ""


class UseCodeRequest(BaseModel):
    referral_code: str
    new_emp_id: str
    new_email: str = ""
    new_name: str = ""


def _generate_code(name: str, emp_id: str) -> str:
    """
    Build a friendly referral code from name + 4 random alphanumeric chars.
    e.g. 'Vijay Sharma' -> 'VIJAY-A3K9'
    """
    base = (name or emp_id or "USER").strip().split()[0].upper()[:8] or "USER"
    # Keep only alphanumeric
    base = "".join(c for c in base if c.isalnum()) or "USER"
    suffix = "".join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(4))
    return f"{base}-{suffix}"


# ─── API 1: GET OR CREATE MY CODE ────────────────────
@router.post("/my-code")
def get_or_create_my_code(req: GetOrCreateCodeRequest, db: Session = Depends(get_db)):
    """Get the current user's referral code, creating one if needed."""
    try:
        existing = db.query(Referral).filter(Referral.owner_emp_id == req.emp_id).first()
        if existing:
            return {
                "referral_code": existing.referral_code,
                "total_signups": existing.total_signups,
                "total_paid_conversions": existing.total_paid_conversions,
                "free_months_earned": existing.free_months_earned,
                "free_months_applied": existing.free_months_applied,
            }

        # Generate unique code (retry on collision)
        for _ in range(5):
            code = _generate_code(req.name, req.emp_id)
            if not db.query(Referral).filter(Referral.referral_code == code).first():
                break
        else:
            raise HTTPException(status_code=500, detail="Failed to generate unique code")

        new_ref = Referral(
            owner_emp_id=req.emp_id,
            owner_name=req.name,
            referral_code=code,
        )
        db.add(new_ref)
        db.commit()
        db.refresh(new_ref)

        logger.info(f"Referral code created for {req.emp_id}: {code}")
        return {
            "referral_code": new_ref.referral_code,
            "total_signups": 0,
            "total_paid_conversions": 0,
            "free_months_earned": 0,
            "free_months_applied": 0,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get/create referral code error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch referral code")


# ─── API 2: VALIDATE CODE ────────────────────────────
@router.get("/validate/{code}")
def validate_code(code: str, db: Session = Depends(get_db)):
    """Check if a referral code is valid. Returns owner name if so."""
    ref = db.query(Referral).filter(Referral.referral_code == code.upper()).first()
    if not ref:
        return {"valid": False}
    return {
        "valid": True,
        "owner_name": ref.owner_name,
        "owner_emp_id": ref.owner_emp_id,
    }


# ─── API 3: USE CODE (on signup) ─────────────────────
@router.post("/use")
def use_referral_code(req: UseCodeRequest, db: Session = Depends(get_db)):
    """Called when a new user signs up with a referral code."""
    try:
        code_upper = req.referral_code.upper().strip()
        ref = db.query(Referral).filter(Referral.referral_code == code_upper).first()
        if not ref:
            raise HTTPException(status_code=404, detail="Invalid referral code")

        # Prevent self-referral
        if ref.owner_emp_id == req.new_emp_id:
            raise HTTPException(status_code=400, detail="Cannot use your own referral code")

        # Prevent duplicate use by same new emp_id
        existing_use = db.query(ReferralSignup).filter(
            ReferralSignup.new_emp_id == req.new_emp_id
        ).first()
        if existing_use:
            raise HTTPException(status_code=400, detail="This account has already used a referral code")

        signup = ReferralSignup(
            referral_code=code_upper,
            referrer_emp_id=ref.owner_emp_id,
            new_emp_id=req.new_emp_id,
            new_email=req.new_email,
            new_name=req.new_name,
        )
        db.add(signup)

        # Increment owner's signup count
        ref.total_signups = (ref.total_signups or 0) + 1
        ref.updated_at = datetime.utcnow()

        db.commit()

        logger.info(f"Referral used: {code_upper} by {req.new_emp_id}")
        return {
            "success": True,
            "referrer_name": ref.owner_name,
            "message": f"Signup credited to {ref.owner_name}",
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Use referral code error: {e}")
        raise HTTPException(status_code=500, detail="Failed to apply referral code")


# ─── API 4: MY REFERRAL STATS ────────────────────────
@router.get("/stats/{emp_id}")
def get_my_stats(emp_id: str, db: Session = Depends(get_db)):
    """Detailed stats + list of people I've referred."""
    ref = db.query(Referral).filter(Referral.owner_emp_id == emp_id).first()
    if not ref:
        return {
            "has_code": False,
            "referrals": [],
        }

    signups = db.query(ReferralSignup).filter(
        ReferralSignup.referrer_emp_id == emp_id
    ).order_by(ReferralSignup.signed_up_at.desc()).all()

    return {
        "has_code": True,
        "referral_code": ref.referral_code,
        "total_signups": ref.total_signups,
        "total_paid_conversions": ref.total_paid_conversions,
        "free_months_earned": ref.free_months_earned,
        "free_months_applied": ref.free_months_applied,
        "pending_reward": max(0, (ref.free_months_earned or 0) - (ref.free_months_applied or 0)),
        "referrals": [
            {
                "new_name": s.new_name,
                "new_emp_id": s.new_emp_id,
                "signed_up_at": str(s.signed_up_at) if s.signed_up_at else None,
                "converted_paid": s.converted_paid_at is not None,
                "converted_at": str(s.converted_paid_at) if s.converted_paid_at else None,
                "reward_credited": s.reward_credited,
            }
            for s in signups
        ],
    }


# ─── API 5: MARK PAID CONVERSION ──────────────────────
# (Called by billing webhook once Razorpay is integrated)
@router.post("/mark-paid/{emp_id}")
def mark_paid_conversion(emp_id: str, db: Session = Depends(get_db)):
    """
    When a referred user upgrades to a paid plan, credit the referrer 1 free month.
    """
    try:
        signup = db.query(ReferralSignup).filter(
            ReferralSignup.new_emp_id == emp_id,
            ReferralSignup.converted_paid_at == None,
        ).first()
        if not signup:
            return {"success": False, "message": "No pending referral for this user"}

        signup.converted_paid_at = datetime.utcnow()
        signup.reward_credited = True

        ref = db.query(Referral).filter(Referral.owner_emp_id == signup.referrer_emp_id).first()
        if ref:
            ref.total_paid_conversions = (ref.total_paid_conversions or 0) + 1
            ref.free_months_earned = (ref.free_months_earned or 0) + 1
            ref.updated_at = datetime.utcnow()

        db.commit()

        logger.info(f"Paid conversion credited: {emp_id} -> referrer {signup.referrer_emp_id}")
        return {
            "success": True,
            "referrer_emp_id": signup.referrer_emp_id,
            "free_month_credited": True,
        }
    except Exception as e:
        logger.error(f"Mark paid conversion error: {e}")
        raise HTTPException(status_code=500, detail="Failed to credit referral")
