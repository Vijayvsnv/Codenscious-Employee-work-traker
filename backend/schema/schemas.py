from pydantic import BaseModel
from typing import List, Optional
from datetime import date



# 🔹 TASK SCHEMA
class TaskCreate(BaseModel):
    task_name: Optional[str] = None
    task_details: Optional[str] = None
    task_status: Optional[str] = None
    time_spent_hours: Optional[int] = None
    expected_completion: Optional[date] = None


# 🔹 REPORT SCHEMA
class ReportCreate(BaseModel):
    emp_id: str   # 🔥 REQUIRED

    name: Optional[str] = None
    report_date: Optional[date] = None

    blockers: Optional[str] = None
    blocker_risk_level: Optional[str] = None

    help_needed: Optional[bool] = None
    help_from: Optional[str] = None

    tomorrow_plan: Optional[str] = None
    mood: Optional[str] = None
    day_summary: Optional[str] = None

    tasks: Optional[List[TaskCreate]] = []
