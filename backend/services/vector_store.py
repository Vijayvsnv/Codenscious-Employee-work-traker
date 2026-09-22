from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.schema import Document
from core.config import settings
from utils.logger import logger
import hashlib
from langchain_openai import OpenAIEmbeddings


# ─── EMBEDDING MODEL ─────────────────────────────────
# def get_embeddings():
#     return GoogleGenerativeAIEmbeddings(
#         model="models/embedding-001",
#         google_api_key=settings.GEMINI_API_KEY
#     )
def get_embeddings():
    return OpenAIEmbeddings(
        model="text-embedding-3-small",
        openai_api_key=settings.OPENAI_API_KEY
    )


# ─── VECTOR STORE ────────────────────────────────────
def get_vector_store():
    return Chroma(
        collection_name="standup_reports",
        embedding_function=get_embeddings(),
        persist_directory="./chroma_db"        # yeh folder auto create hoga
    )


# ─── HELPER: JSON → readable text ────────────────────
def build_document_text(report: dict) -> str:
    tasks_text = ""
    for t in report.get("tasks", []):
        tasks_text += (
            f"\n  - Task: {t.get('task_name', 'N/A')}"
            f" | Status: {t.get('task_status', 'N/A')}"
            f" | Hours: {t.get('time_spent_hours', 0)}"
            f" | Details: {t.get('task_details', 'N/A')}"
            f" | Expected: {t.get('expected_completion', 'N/A')}"
        )

    text = f"""
Employee: {report.get('name', '')} (ID: {report.get('emp_id', '')})
Date: {report.get('report_date', '')}

Tasks:{tasks_text}

Blockers: {report.get('blockers') or 'None'}
Blocker Risk Level: {report.get('blocker_risk_level') or 'None'}

Help Needed: {report.get('help_needed', False)}
Help From: {report.get('help_from') or 'None'}

Tomorrow Plan: {report.get('tomorrow_plan', '')}

Mood: {report.get('mood', '')}
Day Summary: {report.get('day_summary', '')}
""".strip()

    return text


# ─── MAIN: Vector DB me store karo ───────────────────
def store_report_in_vectordb(report: dict, session_id: str) -> dict:
    try:
        doc_text = build_document_text(report)

        # Unique ID banana
        unique_str = f"{report.get('emp_id', '')}_{report.get('report_date', '')}_{session_id}"
        doc_id = hashlib.md5(unique_str.encode()).hexdigest()

        document = Document(
            page_content=doc_text,
            metadata={
                "emp_id": str(report.get("emp_id", "")),
                "emp_name": str(report.get("name", "")),
                "report_date": str(report.get("report_date", "")),
                "mood": str(report.get("mood", "")),
                "session_id": session_id,
                "blocker_risk_level": str(report.get("blocker_risk_level") or "None"),
                "help_needed": str(report.get("help_needed", False)),
            }
        )

        vector_store = get_vector_store()
        vector_store.add_documents(documents=[document], ids=[doc_id])

        logger.info(f"VectorDB store hua: {doc_id} | {report.get('name')}")
        return {"status": "success", "doc_id": doc_id}

    except Exception as e:
        logger.error(f"VectorDB store failed: {e}")
        return {"status": "failed", "error": str(e)}


# ─── BONUS: Search (future RAG ke liye) ──────────────
def search_reports(query: str, emp_id: str = None, k: int = 5) -> list:
    try:
        vector_store = get_vector_store()
        filter_dict = {"emp_id": emp_id} if emp_id else None

        results = vector_store.similarity_search(query=query, k=k, filter=filter_dict)

        logger.info(f"'{query}' → {len(results)} results")
        return results

    except Exception as e:
        logger.error(f"VectorDB search failed: {e}")
        return []