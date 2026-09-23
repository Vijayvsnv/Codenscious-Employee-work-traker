from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
import uuid

from db.database import get_db
from db import crud
from schema.schemas import ReportCreate, TaskCreate
from services.langgraph_flow import standup_graph
from services.memory_service import add_message, clear_session
from services.json_generator import generate_report_json
from utils.logger import logger

from services.vector_store import store_report_in_vectordb
from services.sentiment_service import analyze_sentiment
from services.memory_service import get_full_conversation_text
from models.report_model import DailyReport
import json

router = APIRouter(prefix="/chat", tags=["chat"])

active_sessions: dict = {}


# ─── REQUEST SCHEMAS ─────────────────────────────────
class StartRequest(BaseModel):
    emp_id: str
    emp_name: str

class MessageRequest(BaseModel):
    session_id: str
    message: str

class EndRequest(BaseModel):
    session_id: str
    mood: str
    day_summary: str


# ─── API 1: START SESSION ────────────────────────────
@router.post("/start")
def start_session(req: StartRequest):

    session_id = str(uuid.uuid4())
    config = {"configurable": {"thread_id": session_id}}

    initial_state = {
        "session_id": session_id,
        "emp_name": req.emp_name,
        "emp_id": req.emp_id,
        "user_message": "",
        "ai_response": "",
        "current_phase": "greeting",
        "cross_q_count": 0,
        "tasks_collected": False
    }

    result = standup_graph.invoke(initial_state, config)

    if result.get("ai_response"):
        add_message(session_id, "assistant", result["ai_response"])

    active_sessions[session_id] = {
        "emp_id": req.emp_id,
        "emp_name": req.emp_name,
        "config": config
    }

    logger.info(f"Session started: {session_id} for {req.emp_name}")

    return {
        "session_id": session_id,
        "message": result["ai_response"],
        "phase": result["current_phase"]
    }


# ─── API 2: SEND MESSAGE ─────────────────────────────
@router.post("/message")
def send_message(req: MessageRequest):

    session_id = req.session_id

    if session_id not in active_sessions:
        return {"error": "Session not found. Start new session."}

    session = active_sessions[session_id]
    config = session["config"]

    # ✅ User message store karo
    add_message(session_id, "user", req.message)

    # ✅ Next node pata karo
    current_state = standup_graph.get_state(config)
    next_node = current_state.next[0] if current_state.next else None

    # ✅ State update — as_node specify karo
    standup_graph.update_state(
        config,
        {"user_message": req.message},
        as_node=next_node
    )

    # ✅ Resume graph
    result = standup_graph.invoke(None, config)

    # ✅ AI response store karo
    if result.get("ai_response"):
        add_message(session_id, "assistant", result["ai_response"])

    return {
        "session_id": session_id,
        "message": result["ai_response"],
        "phase": result["current_phase"]
    }


# ─── API 3: END SESSION ──────────────────────────────
@router.post("/end")
def end_session(req: EndRequest, db: Session = Depends(get_db)):

    session_id = req.session_id

    if session_id not in active_sessions:
        return {"error": "Session not found"}

    session = active_sessions[session_id]

    report_data = generate_report_json(
        session_id=session_id,
        emp_id=session["emp_id"],
        emp_name=session["emp_name"],
        mood=req.mood,
        day_summary=req.day_summary
    )

    tasks = [
        TaskCreate(**task)
        for task in report_data.get("tasks", [])
    ]

    report = ReportCreate(
        emp_id=report_data["emp_id"],
        name=report_data["name"],
        report_date=report_data["report_date"],
        tasks=tasks,
        blockers=report_data.get("blockers"),
        blocker_risk_level=report_data.get("blocker_risk_level"),
        help_needed=report_data.get("help_needed", False),
        help_from=report_data.get("help_from"),
        tomorrow_plan=report_data.get("tomorrow_plan"),
        mood=req.mood,
        day_summary=req.day_summary
    )

    crud.create_report(db, report)

    # ✅ Sentiment analysis (LLM-powered, runs on all standup text)
    sentiment_result = analyze_sentiment(
        mood=req.mood,
        day_summary=req.day_summary,
        blockers=report_data.get("blockers", ""),
        tomorrow_plan=report_data.get("tomorrow_plan", ""),
        conversation=get_full_conversation_text(session_id),
    )

    # Attach sentiment to latest report row
    try:
        latest = (
            db.query(DailyReport)
            .filter(DailyReport.emp_id == report.emp_id, DailyReport.date == report.report_date)
            .order_by(DailyReport.id.desc())
            .first()
        )
        if latest:
            latest.sentiment_score = sentiment_result["sentiment_score"]
            latest.sentiment_label = sentiment_result["sentiment_label"]
            latest.sentiment_confidence = sentiment_result["sentiment_confidence"]
            latest.sentiment_signals = json.dumps(sentiment_result["signals"])
            db.commit()
    except Exception as e:
        logger.error(f"Failed to persist sentiment: {e}")

    # ✅ Vector DB me bhi save karo
    vector_result = store_report_in_vectordb(report_data, session_id)
    logger.info(f"VectorDB result: {vector_result}")

    clear_session(session_id)
    active_sessions.pop(session_id, None)

    logger.info(f"Session ended and saved: {session_id}")

    return {
        "message": "Standup saved successfully ✅",
        "report": report_data,
        "sentiment": sentiment_result,
        "vector_db_status": vector_result
    }