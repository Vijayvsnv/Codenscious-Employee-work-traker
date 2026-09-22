from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from utils.logger import logger
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in .env file")

try:
    engine = create_engine(
        DATABASE_URL,
        echo=True,
        pool_pre_ping=True
    )
    logger.info("Database engine created successfully")

except Exception as e:
    logger.error(f"Database connection failed: {e}")
    raise

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()