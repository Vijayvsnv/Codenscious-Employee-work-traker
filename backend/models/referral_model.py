from sqlalchemy import Column, Integer, String, TIMESTAMP, Boolean
from db.database import Base
from datetime import datetime


class Referral(Base):
    """
    Tracks referral codes and successful referrals.
    Each user gets a unique code (e.g. VIJAY-A3K9).
    When someone signs up with the code, we log it here.
    """
    __tablename__ = "referrals"

    id = Column(Integer, primary_key=True, index=True)

    # Referrer (who owns the code)
    owner_emp_id = Column(String, index=True, nullable=False)
    owner_name = Column(String)
    referral_code = Column(String, unique=True, index=True, nullable=False)

    # Referral counts
    total_signups = Column(Integer, default=0)
    total_paid_conversions = Column(Integer, default=0)

    # Rewards
    free_months_earned = Column(Integer, default=0)
    free_months_applied = Column(Integer, default=0)

    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)


class ReferralSignup(Base):
    """
    Log of individual signups that used a referral code.
    """
    __tablename__ = "referral_signups"

    id = Column(Integer, primary_key=True, index=True)

    referral_code = Column(String, index=True, nullable=False)
    referrer_emp_id = Column(String, index=True)

    # New user
    new_emp_id = Column(String, index=True)
    new_email = Column(String)
    new_name = Column(String)

    # Conversion tracking
    signed_up_at = Column(TIMESTAMP, default=datetime.utcnow)
    converted_paid_at = Column(TIMESTAMP)          # when they upgraded to paid plan
    reward_credited = Column(Boolean, default=False)
