from sqlalchemy import Column, Integer, String, Date, Boolean, Text, TIMESTAMP, Float
from db.database import Base
from datetime import datetime


class DailyReport(Base):
    __tablename__ = "daily_reports"

    id = Column(Integer, primary_key=True, index=True)

    emp_id = Column(String)
    name = Column(String)

    date = Column(Date)

    blockers = Column(Text)
    blocker_risk_level = Column(String)

    help_needed = Column(Boolean)
    help_from = Column(Text)

    tomorrow_plan = Column(Text)

    mood = Column(String)

    day_summary = Column(Text)

    # AI Sentiment Analysis (nullable; populated on standup submit)
    sentiment_score = Column(Float)          # -1.0 (very negative) to 1.0 (very positive)
    sentiment_label = Column(String)         # "positive" | "neutral" | "negative"
    sentiment_confidence = Column(Float)     # 0.0 to 1.0
    sentiment_signals = Column(Text)         # JSON: {"stress": 0.6, "frustration": 0.3, "excitement": 0.1}

    created_at = Column(TIMESTAMP, default=datetime.utcnow)


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)

    report_id = Column(Integer)
    emp_id = Column(String)

    date = Column(Date)

    task_name = Column(Text)
    task_details = Column(Text)

    task_status = Column(String)

    time_spent_hours = Column(Integer)

    expected_completion = Column(Date)

    created_at = Column(TIMESTAMP, default=datetime.utcnow)