from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import Depends
from pydantic import BaseModel
from datetime import date, timedelta

from db.database import get_db
from models.report_model import DailyReport, Task
from services.vector_store import search_reports
from services.llm_service import get_llm_response
from core.config import settings
from utils.logger import logger

router = APIRouter(prefix="/admin", tags=["admin"])


# ─── REQUEST SCHEMAS ─────────────────────────────────
class AdminLoginRequest(BaseModel):
    admin_id: str
    password: str

class RAGChatRequest(BaseModel):
    query: str


# ─── API 1: ADMIN LOGIN ──────────────────────────────
@router.post("/login")
def admin_login(req: AdminLoginRequest):
    if req.admin_id == settings.ADMIN_ID and req.password == settings.ADMIN_PASSWORD:
        logger.info(f"Admin logged in: {req.admin_id}")
        return {"success": True, "admin_id": req.admin_id, "name": "Admin"}
    
    logger.warning(f"Failed admin login attempt: {req.admin_id}")
    raise HTTPException(status_code=401, detail="Invalid Admin ID or Password")


# ─── API 2: DASHBOARD STATS ──────────────────────────
@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    try:
        today = date.today()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)

        # Today ke reports
        today_reports = db.query(DailyReport).filter(
            DailyReport.date == today
        ).count()

        # Mood distribution — last 30 days
        mood_data = db.query(
            DailyReport.mood,
            func.count(DailyReport.mood).label("count")
        ).filter(
            DailyReport.date >= month_ago
        ).group_by(DailyReport.mood).all()

        # Blocker risk distribution — last 30 days
        blocker_data = db.query(
            DailyReport.blocker_risk_level,
            func.count(DailyReport.blocker_risk_level).label("count")
        ).filter(
            DailyReport.date >= month_ago,
            DailyReport.blocker_risk_level != None
        ).group_by(DailyReport.blocker_risk_level).all()

        # Daily report count — last 7 days
        daily_counts = db.query(
            DailyReport.date,
            func.count(DailyReport.id).label("count")
        ).filter(
            DailyReport.date >= week_ago
        ).group_by(DailyReport.date).order_by(DailyReport.date).all()

        # Help needed count — last 30 days
        help_needed_count = db.query(DailyReport).filter(
            DailyReport.date >= month_ago,
            DailyReport.help_needed == True
        ).count()

        # Task status distribution — last 30 days
        task_status = db.query(
            Task.task_status,
            func.count(Task.task_status).label("count")
        ).filter(
            Task.date >= month_ago
        ).group_by(Task.task_status).all()

        # Recent 10 reports
        recent_reports = db.query(DailyReport).order_by(
            DailyReport.created_at.desc()
        ).limit(10).all()

        # Total employees
        total_employees = db.query(
            func.count(func.distinct(DailyReport.emp_id))
        ).scalar()

        logger.info("Dashboard stats fetched successfully")

        return {
            "today_reports": today_reports,
            "total_employees": total_employees,
            "help_needed_count": help_needed_count,
            "mood_distribution": [
                {"mood": r.mood, "count": r.count}
                for r in mood_data
            ],
            "blocker_risk": [
                {"level": r.blocker_risk_level, "count": r.count}
                for r in blocker_data
            ],
            "daily_counts": [
                {"date": str(r.date), "count": r.count}
                for r in daily_counts
            ],
            "task_status": [
                {"status": r.task_status, "count": r.count}
                for r in task_status
            ],
            "recent_reports": [
                {
                    "id": r.id,
                    "name": r.name,
                    "emp_id": r.emp_id,
                    "date": str(r.date),
                    "mood": r.mood,
                    "blocker_risk_level": r.blocker_risk_level,
                    "day_summary": r.day_summary,
                    "help_needed": r.help_needed,
                    "blockers": r.blockers,
                    "tomorrow_plan": r.tomorrow_plan
                }
                for r in recent_reports
            ]
        }

    except Exception as e:
        logger.error(f"Dashboard fetch error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch dashboard data")


# ─── API 3: RAG CHATBOT ──────────────────────────────
@router.post("/chat")
def admin_rag_chat(req: RAGChatRequest):
    try:
        today = date.today()

        # Vector DB se relevant documents search karo
        results = search_reports(query=req.query, k=8)

        if not results:
            return {
                "answer": "Database user not found Query Related .",
                "sources": []
            }

        # Context build karo
        context = "\n\n---\n\n".join([doc.page_content for doc in results])

        prompt = f"""
You are an intelligent HR Analytics Assistant for a company called WorkPulse.
You have access to employee daily standup reports stored in a database.
Today's date is: {today}

Admin's Question: {req.query}

Relevant Employee Reports from Database:
{context}

Instructions:
- Answer in the same language as the question (Hindi or English)
- Give clear, structured answer
- Use bullet points where helpful  
- Mention specific employee names and dates when relevant
- If asked about trends or patterns, summarize them clearly
- If asked about a specific employee, focus only on their data
- If data is insufficient to answer, say so clearly
- Be concise but comprehensive
- Do NOT make up any information — only use what is in the reports above
"""

        answer = get_llm_response(prompt)

        logger.info(f"Admin RAG query processed: {req.query}")

        return {
            "answer": answer,
            "sources": [
                {
                    "emp_name": doc.metadata.get("emp_name"),
                    "emp_id": doc.metadata.get("emp_id"),
                    "date": doc.metadata.get("report_date"),
                    "mood": doc.metadata.get("mood")
                }
                for doc in results
            ]
        }

    except Exception as e:
        logger.error(f"Admin RAG chat error: {e}")
        raise HTTPException(status_code=500, detail="Chat processing failed")


# ─── API 4: ALL EMPLOYEES LIST ───────────────────────
@router.get("/employees")
def get_all_employees(db: Session = Depends(get_db)):
    try:
        employees = db.query(
            DailyReport.emp_id,
            DailyReport.name,
            func.count(DailyReport.id).label("total_reports"),
            func.max(DailyReport.date).label("last_report"),
        ).group_by(
            DailyReport.emp_id,
            DailyReport.name
        ).all()

        return [
            {
                "emp_id": e.emp_id,
                "name": e.name,
                "total_reports": e.total_reports,
                "last_report": str(e.last_report)
            }
            for e in employees
        ]

    except Exception as e:
        logger.error(f"Employees fetch error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch employees")
    


# ─── API 5: HELP REQUESTS DETAIL ─────────────────────
@router.get("/help-requests")
def get_help_requests(db: Session = Depends(get_db)):
    try:
        month_ago = date.today() - timedelta(days=30)
        reports = db.query(DailyReport).filter(
            DailyReport.date >= month_ago,
            DailyReport.help_needed == True
        ).order_by(DailyReport.date.desc()).all()

        return [
            {
                "name": r.name,
                "emp_id": r.emp_id,
                "date": str(r.date),
                "help_from": r.help_from,
                "day_summary": r.day_summary,
                "blockers": r.blockers
            }
            for r in reports
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── API 6: BLOCKER DETAIL ────────────────────────────
@router.get("/blockers/{risk_level}")
def get_blockers_by_risk(risk_level: str, db: Session = Depends(get_db)):
    try:
        month_ago = date.today() - timedelta(days=30)
        reports = db.query(DailyReport).filter(
            DailyReport.date >= month_ago,
            DailyReport.blocker_risk_level == risk_level
        ).order_by(DailyReport.date.desc()).all()

        return [
            {
                "name": r.name,
                "emp_id": r.emp_id,
                "date": str(r.date),
                "blockers": r.blockers,
                "blocker_risk_level": r.blocker_risk_level,
                "tomorrow_plan": r.tomorrow_plan
            }
            for r in reports
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── API 7: TODAY REPORTS DETAIL ─────────────────────
@router.get("/today-reports")
def get_today_reports(db: Session = Depends(get_db)):
    try:
        reports = db.query(DailyReport).filter(
            DailyReport.date == date.today()
        ).order_by(DailyReport.created_at.desc()).all()

        return [
            {
                "name": r.name,
                "emp_id": r.emp_id,
                "date": str(r.date),
                "mood": r.mood,
                "blockers": r.blockers,
                "blocker_risk_level": r.blocker_risk_level,
                "tomorrow_plan": r.tomorrow_plan,
                "day_summary": r.day_summary,
                "help_needed": r.help_needed,
                "help_from": r.help_from
            }
            for r in reports
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── API 8: MOOD DETAIL ───────────────────────────────
@router.get("/mood/{mood}")
def get_mood_detail(mood: str, db: Session = Depends(get_db)):
    try:
        month_ago = date.today() - timedelta(days=30)
        reports = db.query(DailyReport).filter(
            DailyReport.date >= month_ago,
            DailyReport.mood == mood
        ).order_by(DailyReport.date.desc()).all()

        return [
            {
                "name": r.name,
                "emp_id": r.emp_id,
                "date": str(r.date),
                "mood": r.mood,
                "day_summary": r.day_summary,
                "blockers": r.blockers
            }
            for r in reports
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))