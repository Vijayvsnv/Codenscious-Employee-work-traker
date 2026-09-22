from typing import TypedDict
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from services.llm_service import get_llm_response
from services.memory_service import get_history


# ─── STATE ───────────────────────────────────────────
class StandupState(TypedDict):
    session_id: str
    emp_name: str
    emp_id: str
    user_message: str
    ai_response: str
    current_phase: str
    cross_q_count: int
    tasks_collected: bool


# ─── HELPER ──────────────────────────────────────────
def build_conv_text(session_id: str) -> str:
    history = get_history(session_id)
    lines = []
    for msg in history:
        role = "Employee" if msg["role"] == "user" else "AI"
        lines.append(f"{role}: {msg['content']}")
    return "\n".join(lines)


# ─── NODE 1: GREETING ────────────────────────────────
def greeting_node(state: StandupState) -> StandupState:

    ai_msg = f"Hey {state['emp_name']}! How was your day today? Let's go through your tasks."

    return {
        **state,
        "ai_response": ai_msg,
        "current_phase": "task"
    }
# def greeting_node(state: StandupState) -> StandupState:
#     prompt = f"""
# You are StandupAI, a friendly daily standup assistant.
# Employee name: {state['emp_name']}

# Greet them warmly and ask how their day was today.
# Keep it short and natural. 1-2 lines only.
# """
#     ai_msg = get_llm_response(prompt)

#     return {
#         **state,
#         "ai_response": ai_msg,
#         "current_phase": "task"
#     }


# ─── NODE 2: TASK NODE ───────────────────────────────
def task_node(state: StandupState) -> StandupState:
    conv = build_conv_text(state["session_id"])

#     prompt = f"""
# You are StandupAI, a professional standup assistant.
# Employee name: {state['emp_name']}

# Conversation so far:
# {conv}

# Now ask about today's tasks in detail:
# - What tasks did they work on today?
# - What is the current status of each task?
# - How many hours did they spend on each?

# Be conversational and friendly. 2-3 lines only.
# """
    prompt = f"""
You are StandupAI.

Conversation:
{conv}

Ask the user:

"Please list today's tasks briefly (one line each, like: backend, frontend, testing)"

Keep it simple.
"""
    ai_msg = get_llm_response(prompt)

    return {
        **state,
        "ai_response": ai_msg,
        "user_message": "",
        "current_phase": "cross_question"
    }


# ─── NODE 3: CROSS QUESTION ──────────────────────────
def cross_question_node(state: StandupState) -> StandupState:
    conv = build_conv_text(state["session_id"])
    count = state.get("cross_q_count", 0)

#     prompt = f"""
# You are StandupAI, a professional standup assistant.

# Full conversation so far:
# {conv}

# Ask ONE intelligent follow-up question about the tasks mentioned.

# STRICT RULES:
# - Do NOT repeat any question already asked
# - Always dig into something NEW
# - Focus on missing information:
#     - completion percentage
#     - expected deadline
#     - next steps after this task
#     - why this specific approach/tool was chosen
#     - any challenges faced while implementing

# If you already have COMPLETE details about ALL tasks
# (status clear, completion % known, deadline known, next steps clear)
# AND minimum 2 follow-up questions have already been asked,
# reply with ONLY this exact word: TASKS_COMPLETE
# """
    prompt = f"""
You are StandupAI.

Conversation:
{conv}

Identify tasks mentioned by the user.

LOGIC:
- If only ONE task → ask deeper questions (process, steps, tools used)
- If MULTIPLE tasks → ask brief questions for each task

For EACH task:
1. What exactly was done?
2. Is it completed or not?
3. Time spent OR ETA if pending

RULES:
- Cover ALL tasks mentioned
- Do NOT skip any task
- Do NOT repeat same task again and again
- Keep questions short and clear

If all tasks are covered → reply TASKS_COMPLETE
"""
    ai_msg = get_llm_response(prompt)

    # Max limit
    if count >= 5:
        return {
            **state,
            "ai_response": "",
            "user_message": "",
            "tasks_collected": True,
            "current_phase": "blocker"
        }

    # Min 2 ke baad exit allow
    if ai_msg.strip() == "TASKS_COMPLETE" and count >= 2:
        return {
            **state,
            "ai_response": "",
            "user_message": "",
            "tasks_collected": True,
            "current_phase": "blocker"
        }

    return {
        **state,
        "ai_response": ai_msg,
        "user_message": "",
        "cross_q_count": count + 1,
        "current_phase": "cross_question"
    }


# ─── NODE 4: BLOCKER NODE ────────────────────────────
def blocker_node(state: StandupState) -> StandupState:
    conv = build_conv_text(state["session_id"])

#     prompt = f"""
# You are StandupAI, a professional standup assistant.
# Employee name: {state['emp_name']}

# Conversation so far:
# {conv}

# Now ask about blockers faced today.
# Cover these naturally:
# - What blockers or issues came up today?
# - What was the impact? (deadline delay? integration issue? review pending?)
# - If not resolved soon, what will be the effect on work?
# - What is the risk level? (Low / Medium / High)

# Ask conversationally. 2-3 lines only.
# """
    prompt = f"""
You are StandupAI.

Conversation:
{conv}

Ask about blockers in structured way:

- Did you face any blockers today?
- What type of risk? (Timeline / Quality / Integration / None)
- Do you need escalation? If yes → from whom?

Keep it short and clear.
"""
    ai_msg = get_llm_response(prompt)

    return {
        **state,
        "ai_response": ai_msg,
        "user_message": "",
        "current_phase": "tomorrow"
    }


# ─── NODE 5: TOMORROW NODE ───────────────────────────
def tomorrow_node(state: StandupState) -> StandupState:
    conv = build_conv_text(state["session_id"])

#     prompt = f"""
# You are StandupAI, a professional standup assistant.
# Employee name: {state['emp_name']}

# Conversation so far:
# {conv}

# Now ask about tomorrow's plan:
# - What tasks will they focus on tomorrow?
# - Any meetings or reviews scheduled?
# - Do they need help from anyone specific?

# Keep it short and conversational. 2-3 lines.
# """

    prompt = f"""
You are StandupAI.

Conversation:
{conv}

Ask about tomorrow plan:

- What tasks will you work on tomorrow?
- What is priority (1,2,3)?
- Expected ETA for completion?

Keep it simple and structured.
"""
    ai_msg = get_llm_response(prompt)

    return {
        **state,
        "ai_response": ai_msg,
        "user_message": "",
        "current_phase": "mood"
    }


# ─── NODE 6: MOOD NODE ───────────────────────────────
def mood_node(state: StandupState) -> StandupState:
    conv = build_conv_text(state["session_id"])

    prompt = f"""
You are StandupAI, a professional standup assistant.
Employee name: {state['emp_name']}

Conversation so far:
{conv}

Now wrap up the standup warmly. Ask them:
1. Describe today in ONE line
2. Select mood: [ Low ] [ Medium ] [ High ]

Example:
"Almost done {state['emp_name']}! Just two quick things —
describe your day in one line, and select your mood below:
[ Low ] [ Medium ] [ High ]"
"""
    ai_msg = get_llm_response(prompt)

    return {
        **state,
        "ai_response": ai_msg,
        "user_message": "",
        "current_phase": "done"
    }


# ─── CONDITIONAL EDGE ────────────────────────────────
def route_cross_q(state: StandupState) -> str:
    if state["tasks_collected"] or state["cross_q_count"] >= 6:
        return "blocker_node"
    return "cross_question_node"


# ─── GRAPH BUILD ─────────────────────────────────────
def build_graph():
    graph = StateGraph(StandupState)

    graph.add_node("greeting_node", greeting_node)
    graph.add_node("task_node", task_node)
    graph.add_node("cross_question_node", cross_question_node)
    graph.add_node("blocker_node", blocker_node)
    graph.add_node("tomorrow_node", tomorrow_node)
    graph.add_node("mood_node", mood_node)

    graph.set_entry_point("greeting_node")

    graph.add_edge("greeting_node", "task_node")
    graph.add_edge("task_node", "cross_question_node")
    graph.add_conditional_edges(
        "cross_question_node",
        route_cross_q,
        {
            "blocker_node": "blocker_node",
            "cross_question_node": "cross_question_node"
        }
    )
    graph.add_edge("blocker_node", "tomorrow_node")
    graph.add_edge("tomorrow_node", "mood_node")
    graph.add_edge("mood_node", END)

    checkpointer = MemorySaver()

    return graph.compile(
        checkpointer=checkpointer,
        interrupt_before=[
            "task_node",
            "cross_question_node",
            "blocker_node",
            "tomorrow_node",
            "mood_node"
        ]
    )


standup_graph = build_graph()