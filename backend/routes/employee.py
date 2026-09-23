from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import date, timedelta
from typing import Optional

from pydantic import BaseModel

from db.database import get_db
from models.report_model import DailyReport, Task
from services.blocker_service import suggest_blocker_resolution
from utils.logger import logger


class BlockerSuggestionRequest(BaseModel):
    blocker: str
    emp_id: Optional[str] = None

router = APIRouter(prefix="/employee", tags=["employee"])


# ─── HELPER: streak calculator ───────────────────────
def _calculate_streak(dates: list[date]) -> int:
    if not dates:
        return 0
    sorted_dates = sorted(set(dates), reverse=True)
    today = date.today()
    if sorted_dates[0] not in (today, today - timedelta(days=1)):
        return 0
    streak = 1
    for i in range(1, len(sorted_dates)):
        if (sorted_dates[i - 1] - sorted_dates[i]).days == 1:
            streak += 1
        else:
            break
    return streak


# ─── API 1: OVERVIEW STATS ───────────────────────────
@router.get("/{emp_id}/stats")
def get_employee_stats(emp_id: str, db: Session = Depends(get_db)):
    try:
        today = date.today()
        month_ago = today - timedelta(days=30)

        total_reports = db.query(DailyReport).filter(
            DailyReport.emp_id == emp_id
        ).count()

        if total_reports == 0:
            return {
                "total_reports": 0,
                "current_streak": 0,
                "reports_this_month": 0,
                "avg_mood_score": 0,
                "task_completion_rate": 0,
                "total_tasks": 0,
                "completed_tasks": 0,
                "blocker_count": 0,
                "help_requests": 0,
                "logged_today": False,
            }

        reports_this_month = db.query(DailyReport).filter(
            DailyReport.emp_id == emp_id,
            DailyReport.date >= month_ago
        ).count()

        # Streak calculation
        dates = db.query(DailyReport.date).filter(
            DailyReport.emp_id == emp_id
        ).order_by(DailyReport.date.desc()).limit(60).all()
        streak = _calculate_streak([d[0] for d in dates])

        # Mood score (High=3, Medium=2, Low=1)
        mood_map = {"High": 3, "Medium": 2, "Low": 1}
        moods = db.query(DailyReport.mood).filter(
            DailyReport.emp_id == emp_id,
            DailyReport.date >= month_ago,
            DailyReport.mood != None
        ).all()
        mood_scores = [mood_map.get(m[0], 0) for m in moods if m[0] in mood_map]
        avg_mood = round(sum(mood_scores) / len(mood_scores), 2) if mood_scores else 0

        # Task completion rate
        total_tasks = db.query(Task).filter(
            Task.emp_id == emp_id,
            Task.date >= month_ago
        ).count()
        completed_tasks = db.query(Task).filter(
            Task.emp_id == emp_id,
            Task.date >= month_ago,
            Task.task_status == "completed"
        ).count()
        completion_rate = round((completed_tasks / total_tasks) * 100, 1) if total_tasks > 0 else 0

        # Blockers + help requests
        blocker_count = db.query(DailyReport).filter(
            DailyReport.emp_id == emp_id,
            DailyReport.date >= month_ago,
            DailyReport.blockers != None,
            DailyReport.blockers != ""
        ).count()

        help_requests = db.query(DailyReport).filter(
            DailyReport.emp_id == emp_id,
            DailyReport.date >= month_ago,
            DailyReport.help_needed == True
        ).count()

        logged_today = db.query(DailyReport).filter(
            DailyReport.emp_id == emp_id,
            DailyReport.date == today
        ).count() > 0

        return {
            "total_reports": total_reports,
            "current_streak": streak,
            "reports_this_month": reports_this_month,
            "avg_mood_score": avg_mood,
            "task_completion_rate": completion_rate,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "blocker_count": blocker_count,
            "help_requests": help_requests,
            "logged_today": logged_today,
        }
    except Exception as e:
        logger.error(f"Employee stats error for {emp_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch stats")


# ─── API 2: MOOD TREND ───────────────────────────────
@router.get("/{emp_id}/mood-trend")
def get_mood_trend(
    emp_id: str,
    days: int = Query(30, ge=7, le=90),
    db: Session = Depends(get_db)
):
    try:
        start_date = date.today() - timedelta(days=days)
        reports = db.query(
            DailyReport.date,
            DailyReport.mood,
            DailyReport.blocker_risk_level
        ).filter(
            DailyReport.emp_id == emp_id,
            DailyReport.date >= start_date
        ).order_by(DailyReport.date).all()

        mood_map = {"High": 3, "Medium": 2, "Low": 1}

        return [
            {
                "date": str(r.date),
                "mood": r.mood,
                "mood_score": mood_map.get(r.mood, 0),
                "blocker_risk": r.blocker_risk_level or "None",
            }
            for r in reports
        ]
    except Exception as e:
        logger.error(f"Mood trend error for {emp_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch mood trend")


# ─── API 3: TASK STATUS BREAKDOWN ────────────────────
@router.get("/{emp_id}/task-breakdown")
def get_task_breakdown(
    emp_id: str,
    days: int = Query(30, ge=7, le=90),
    db: Session = Depends(get_db)
):
    try:
        start_date = date.today() - timedelta(days=days)
        rows = db.query(
            Task.task_status,
            func.count(Task.id).label("count"),
            func.sum(Task.time_spent_hours).label("hours"),
        ).filter(
            Task.emp_id == emp_id,
            Task.date >= start_date
        ).group_by(Task.task_status).all()

        return [
            {"status": r.task_status or "unknown", "count": r.count, "hours": int(r.hours or 0)}
            for r in rows
        ]
    except Exception as e:
        logger.error(f"Task breakdown error for {emp_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch task breakdown")


# ─── API 4: REPORTS LIST (paginated) ─────────────────
@router.get("/{emp_id}/reports")
def get_employee_reports(
    emp_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    try:
        offset = (page - 1) * limit
        total = db.query(DailyReport).filter(DailyReport.emp_id == emp_id).count()
        reports = db.query(DailyReport).filter(
            DailyReport.emp_id == emp_id
        ).order_by(DailyReport.date.desc()).offset(offset).limit(limit).all()

        return {
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": (total + limit - 1) // limit,
            "reports": [
                {
                    "id": r.id,
                    "date": str(r.date),
                    "mood": r.mood,
                    "day_summary": r.day_summary,
                    "blockers": r.blockers,
                    "blocker_risk_level": r.blocker_risk_level,
                    "help_needed": r.help_needed,
                    "help_from": r.help_from,
                    "tomorrow_plan": r.tomorrow_plan,
                }
                for r in reports
            ]
        }
    except Exception as e:
        logger.error(f"Reports list error for {emp_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch reports")


# ─── API 5: REPORT DETAIL (with tasks) ───────────────
@router.get("/{emp_id}/report/{report_id}")
def get_report_detail(emp_id: str, report_id: int, db: Session = Depends(get_db)):
    try:
        report = db.query(DailyReport).filter(
            DailyReport.id == report_id,
            DailyReport.emp_id == emp_id
        ).first()

        if not report:
            raise HTTPException(status_code=404, detail="Report not found")

        tasks = db.query(Task).filter(Task.report_id == report_id).all()

        return {
            "report": {
                "id": report.id,
                "date": str(report.date),
                "mood": report.mood,
                "day_summary": report.day_summary,
                "blockers": report.blockers,
                "blocker_risk_level": report.blocker_risk_level,
                "help_needed": report.help_needed,
                "help_from": report.help_from,
                "tomorrow_plan": report.tomorrow_plan,
            },
            "tasks": [
                {
                    "id": t.id,
                    "task_name": t.task_name,
                    "task_details": t.task_details,
                    "task_status": t.task_status,
                    "time_spent_hours": t.time_spent_hours,
                    "expected_completion": str(t.expected_completion) if t.expected_completion else None,
                }
                for t in tasks
            ]
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Report detail error for {emp_id}/{report_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch report")


# ─── API 6a: SENTIMENT TREND ─────────────────────────
@router.get("/{emp_id}/sentiment-trend")
def get_sentiment_trend(
    emp_id: str,
    days: int = Query(30, ge=7, le=90),
    db: Session = Depends(get_db)
):
    try:
        start_date = date.today() - timedelta(days=days)
        rows = db.query(
            DailyReport.date,
            DailyReport.sentiment_score,
            DailyReport.sentiment_label,
            DailyReport.mood,
        ).filter(
            DailyReport.emp_id == emp_id,
            DailyReport.date >= start_date,
            DailyReport.sentiment_score != None,
        ).order_by(DailyReport.date).all()

        return [
            {
                "date": str(r.date),
                "sentiment_score": r.sentiment_score,
                "sentiment_label": r.sentiment_label,
                "mood": r.mood,
            }
            for r in rows
        ]
    except Exception as e:
        logger.error(f"Sentiment trend error for {emp_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch sentiment trend")


# ─── API 6b: BLOCKER RESOLUTION SUGGESTIONS ──────────
@router.post("/blocker/suggest")
def get_blocker_suggestion(req: BlockerSuggestionRequest):
    """
    Given a blocker description, RAG-search past standups for similar blockers
    and get LLM-generated resolution suggestions.
    """
    result = suggest_blocker_resolution(
        blocker_text=req.blocker,
        emp_id=req.emp_id,
        exclude_emp_id=True,
    )
    return result


# ─── API 7: RECENT TASKS ─────────────────────────────
@router.get("/{emp_id}/recent-tasks")
def get_recent_tasks(
    emp_id: str,
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    try:
        q = db.query(Task).filter(Task.emp_id == emp_id)
        if status:
            q = q.filter(Task.task_status == status)
        tasks = q.order_by(Task.date.desc(), Task.id.desc()).limit(limit).all()

        return [
            {
                "id": t.id,
                "date": str(t.date),
                "task_name": t.task_name,
                "task_details": t.task_details,
                "task_status": t.task_status,
                "time_spent_hours": t.time_spent_hours,
                "expected_completion": str(t.expected_completion) if t.expected_completion else None,
            }
            for t in tasks
        ]
    except Exception as e:
        logger.error(f"Recent tasks error for {emp_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch tasks")
