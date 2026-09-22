from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.database import get_db
from db import crud
from schema.schemas import ReportCreate
from utils.logger import logger

router = APIRouter()

@router.post("/report")
def create_report_api(report: ReportCreate, db: Session = Depends(get_db)):

    logger.info(f"Incoming report for emp_id: {report.emp_id}")

    try:
        result = crud.create_report(db, report)

        logger.info(f"Report saved for emp_id: {report.emp_id}")
        return result

    except Exception as e:
        logger.error(f"Error: {e}")
        return {"error": "Something went wrong"}