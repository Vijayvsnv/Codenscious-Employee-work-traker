import json
from datetime import date
from services.llm_service import get_llm_response
from services.memory_service import get_history
from utils.logger import logger


# ─── HELPER: Full conversation text banana ────────────
def build_conv_text(session_id: str) -> str:
    history = get_history(session_id)
    lines = []
    for msg in history:
        role = "Employee" if msg["role"] == "user" else "AI"
        lines.append(f"{role}: {msg['content']}")
    return "\n".join(lines)


# ─── MAIN FUNCTION ───────────────────────────────────
def generate_report_json(
    session_id: str,
    emp_id: str,
    emp_name: str,
    mood: str,
    day_summary: str
) -> dict:

    conversation = build_conv_text(session_id)
    today = str(date.today())

    prompt = f"""
You are a data extraction AI.
Extract structured information from this standup conversation.

Return ONLY a valid JSON object.
No explanation, no markdown, no backticks.
Just raw JSON.

Employee ID: {emp_id}
Employee Name: {emp_name}
Date: {today}
Mood selected by employee: {mood}
Day summary written by employee: {day_summary}

Full Conversation:
{conversation}

Extract and return this exact JSON structure:
{{
    "emp_id": "{emp_id}",
    "name": "{emp_name}",
    "report_date": "{today}",
    "tasks": [
        {{
            "task_name": "exact task name",
            "task_details": "what was done in detail",
            "task_status": "in_progress or completed or blocked",
            "time_spent_hours": 0,
            "expected_completion": "YYYY-MM-DD or null"
        }}
    ],
    "blockers": "blocker description or null",
    "blocker_risk_level": "Low or Medium or High or null",
    "help_needed": true or false,
    "help_from": "person or team name or null",
    "tomorrow_plan": "what they plan to do tomorrow",
    "mood": "{mood}",
    "day_summary": "{day_summary}"
}}

RULES:
- Extract ALL tasks mentioned in conversation
- If no blocker mentioned, set blockers to null
- If help not needed, set help_needed to false
- time_spent_hours must be integer
- Return ONLY JSON, nothing else
"""

    raw = get_llm_response(prompt)

    # Clean response — backticks aa gaye to remove karo
    raw = raw.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()

    try:
        report = json.loads(raw)
        logger.info(f"JSON generated successfully for {emp_name}")
        return report

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse failed for {emp_name}: {e}")

        # Fallback — empty but valid report return karo
        return {
            "emp_id": emp_id,
            "name": emp_name,
            "report_date": today,
            "tasks": [],
            "blockers": None,
            "blocker_risk_level": None,
            "help_needed": False,
            "help_from": None,
            "tomorrow_plan": "",
            "mood": mood,
            "day_summary": day_summary
        }