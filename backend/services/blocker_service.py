"""
Blocker Resolution Suggestions.
When an employee mentions a blocker, RAG-search past standups for similar blockers
that were later resolved, and use an LLM to synthesize actionable advice.
"""

from services.vector_store import search_reports
from services.llm_service import get_llm_response
from utils.logger import logger


SUGGESTION_PROMPT = """
You are a helpful engineering manager assistant. An employee just reported this blocker:

BLOCKER: "{blocker}"

Below are similar blockers from past standups across the team (retrieved via vector search).
Use them to suggest 2-4 concrete, actionable resolution steps.

PAST SIMILAR BLOCKERS:
{context}

RULES:
- Be concise and specific. Bullet points only.
- If a past teammate resolved a similar issue, mention their name and date (e.g. "Rahul resolved this on 2026-08-15 by...").
- If no clear past resolution exists, suggest general best-practice steps.
- Do NOT fabricate. Only cite past incidents visible in the context above.
- If the context is empty or irrelevant, say so plainly and offer generic advice.

FORMAT (markdown):
**Suggested next steps:**
- <step 1>
- <step 2>
- <step 3>

**Past reference:** <name + date + one-line note>, or "No matching past incident found."
"""


def suggest_blocker_resolution(
    blocker_text: str,
    emp_id: str = None,
    exclude_emp_id: bool = True,
    k: int = 5,
) -> dict:
    """
    Search vector DB for similar past blockers and return an LLM-generated suggestion.

    Args:
        blocker_text: The current blocker description.
        emp_id: Optional emp_id to exclude from search (so we don't return the employee's own past)
                or to filter to (if exclude_emp_id=False).
        exclude_emp_id: If True and emp_id given, exclude that employee's past reports.
        k: Number of past reports to retrieve.
    """
    if not blocker_text or not blocker_text.strip():
        return {
            "suggestion": "",
            "matched": 0,
            "sources": [],
            "error": "Empty blocker text",
        }

    try:
        # Vector search with blocker phrasing
        query = f"blocker: {blocker_text}"
        results = search_reports(query=query, k=k * 2)  # over-fetch, filter below

        # Filter for entries that actually have blocker content
        filtered = []
        for doc in results:
            meta = doc.metadata or {}
            # If excluding this employee, skip
            if exclude_emp_id and emp_id and meta.get("emp_id") == emp_id:
                continue
            # Only keep docs whose content mentions blockers (heuristic)
            content = doc.page_content or ""
            if "Blockers:" in content and "Blockers: None" not in content:
                filtered.append(doc)
            if len(filtered) >= k:
                break

        if not filtered:
            return {
                "suggestion": (
                    "**Suggested next steps:**\n"
                    "- Break the blocker into a specific technical/process/people bucket\n"
                    "- Post in your team channel with what you've already tried\n"
                    "- Timebox the block (e.g. 2 hours) and escalate if unresolved\n\n"
                    "**Past reference:** No matching past incident found."
                ),
                "matched": 0,
                "sources": [],
            }

        # Build context
        context_lines = []
        sources = []
        for i, doc in enumerate(filtered, start=1):
            meta = doc.metadata or {}
            context_lines.append(f"[{i}] {doc.page_content}")
            sources.append({
                "emp_name": meta.get("emp_name"),
                "emp_id": meta.get("emp_id"),
                "date": meta.get("report_date"),
                "blocker_risk": meta.get("blocker_risk_level"),
            })

        context = "\n\n---\n\n".join(context_lines)

        prompt = SUGGESTION_PROMPT.format(blocker=blocker_text, context=context)
        suggestion = get_llm_response(prompt)

        logger.info(f"Blocker suggestion generated | matches={len(filtered)}")
        return {
            "suggestion": suggestion,
            "matched": len(filtered),
            "sources": sources,
        }

    except Exception as e:
        logger.error(f"Blocker suggestion error: {e}")
        return {
            "suggestion": (
                "Unable to fetch suggestions right now. Try posting in your team channel with:\n"
                "- What you're trying to do\n"
                "- What you've tried\n"
                "- The exact error/behavior you're seeing"
            ),
            "matched": 0,
            "sources": [],
            "error": str(e),
        }
