from fastapi import FastAPI
from db.database import engine, Base

from models import report_model
from models import user_model

from routes import report

from routes import admin

from routes import chat
from routes import employee
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)
app.include_router(report.router)
app.include_router(chat.router)
app.include_router(admin.router)
app.include_router(employee.router)
@app.get("/")
def home():
    return {"message": "StandupAI running "}