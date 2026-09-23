"""
AI-powered sentiment analysis on standup text.
Goes deeper than the self-reported mood — detects real signals from language.
"""

import json
from services.llm_service import get_llm_response
from utils.logger import logger


SENTIMENT_PROMPT = """
You are a workplace sentiment analyst. Analyze this employee standup and return ONLY a JSON object.

Employee's mood (self-reported): {mood}
Day summary: {day_summary}
Blockers: {blockers}
Tomorrow's plan: {tomorrow_plan}
Full conversation excerpt: {conversation}

Return this EXACT JSON structure (no markdown, no explanation):
{{
    "sentiment_score": <float from -1.0 (very negative) to 1.0 (very positive)>,
    "sentiment_label": "positive" | "neutral" | "negative",
    "sentiment_confidence": <float 0.0 to 1.0>,
    "signals": {{
        "stress": <float 0.0 to 1.0>,
        "frustration": <float 0.0 to 1.0>,
        "excitement": <float 0.0 to 1.0>,
        "engagement": <float 0.0 to 1.0>,
        "confidence": <float 0.0 to 1.0>
    }},
    "reasoning": "<one short sentence explaining the sentiment>"
}}

Rules:
- Look BEYOND the self-reported mood. Sometimes people say "kaam thik chal raha hai" but tone shows frustration.
- Hindi/Hinglish is fine — treat "thoda pareshan hoon" as stress signal, "bahut mazaa aaya" as excitement.
- If content is minimal or vague, lower confidence.
- Be honest: if the standup shows red flags, mark it negative.
"""


def analyze_sentiment(
    mood: str,
    day_summary: str,
    blockers: str,
    tomorrow_plan: str,
    conversation: str = "",
) -> dict:
    """
    Run LLM sentiment analysis on standup content.
    Returns dict with score, label, confidence, signals, reasoning.
    On failure returns neutral defaults.
    """
    try:
        # Truncate conversation to prevent runaway tokens
        conv = (conversation or "")[:2000]

        prompt = SENTIMENT_PROMPT.format(
            mood=mood or "not set",
            day_summary=day_summary or "not provided",
            blockers=blockers or "none reported",
            tomorrow_plan=tomorrow_plan or "not provided",
            conversation=conv or "not available",
        )

        raw = get_llm_response(prompt)
        raw = raw.strip().replace("```json", "").replace("```", "").strip()

        data = json.loads(raw)

        # Validation and clamping
        score = max(-1.0, min(1.0, float(data.get("sentiment_score", 0.0))))
        label = data.get("sentiment_label", "neutral")
        if label not in ("positive", "neutral", "negative"):
            label = "neutral"
        confidence = max(0.0, min(1.0, float(data.get("sentiment_confidence", 0.5))))

        signals = data.get("signals", {}) or {}
        # Clamp each signal
        for k in ("stress", "frustration", "excitement", "engagement", "confidence"):
            signals[k] = max(0.0, min(1.0, float(signals.get(k, 0.0))))

        result = {
            "sentiment_score": score,
            "sentiment_label": label,
            "sentiment_confidence": confidence,
            "signals": signals,
            "reasoning": data.get("reasoning", ""),
        }

        logger.info(f"Sentiment analysis: {label} ({score:+.2f}) confidence={confidence:.2f}")
        return result

    except json.JSONDecodeError as e:
        logger.error(f"Sentiment JSON parse failed: {e}")
        return _neutral_fallback()
    except Exception as e:
        logger.error(f"Sentiment analysis error: {e}")
        return _neutral_fallback()


def _neutral_fallback() -> dict:
    return {
        "sentiment_score": 0.0,
        "sentiment_label": "neutral",
        "sentiment_confidence": 0.0,
        "signals": {"stress": 0.0, "frustration": 0.0, "excitement": 0.0, "engagement": 0.0, "confidence": 0.0},
        "reasoning": "Analysis unavailable",
    }
