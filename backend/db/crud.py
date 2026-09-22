from sqlalchemy.orm import Session
from models import report_model
from schema.schemas import ReportCreate


def create_report(db: Session, report: ReportCreate):

    # 🔹 1. Report save karna
    db_report = report_model.DailyReport(
        emp_id=report.emp_id,
        name=report.name,
        date=report.report_date,
        blockers=report.blockers,
        blocker_risk_level=report.blocker_risk_level,
        help_needed=report.help_needed,
        help_from=report.help_from,
        tomorrow_plan=report.tomorrow_plan,
        mood=report.mood,
        day_summary=report.day_summary
    )

    db.add(db_report)
    db.commit()
    db.refresh(db_report)

    # 🔹 2. Tasks save karna
    if report.tasks:
        for task in report.tasks:
            db_task = report_model.Task(
                report_id=db_report.id,
                emp_id=report.emp_id,
                date=report.report_date,
                task_name=task.task_name,
                task_details=task.task_details,
                task_status=task.task_status,
                time_spent_hours=task.time_spent_hours,
                expected_completion=task.expected_completion
            )
            db.add(db_task)

        db.commit()

    return {"message": "Report saved successfully"}