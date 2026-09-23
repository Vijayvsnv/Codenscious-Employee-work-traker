# Codenscious WorkPulse

AI-powered daily standup + HR analytics platform. Employees log daily standups via a conversational AI, and admins get real-time analytics + a RAG assistant to query team data in natural language.

## Tech Stack

**Backend**
- FastAPI (Python)
- SQLAlchemy + PostgreSQL
- LangGraph (multi-phase conversation flow)
- LangChain + OpenAI (`gpt-4o-mini`)
- ChromaDB (vector store for RAG)

**Frontend**
- React 19 + Vite
- Tailwind CSS + custom design system
- Firebase Auth (employee login)
- Recharts (analytics)
- Sonner (toasts)

## Features

- Conversational AI standups (greeting → tasks → cross-questions → blockers → tomorrow plan → mood)
- Employee dashboard with guidelines and one-click standup
- Admin analytics: mood distribution, blocker risk, task status, daily activity
- RAG chat: ask anything about your team ("Who had blockers today?")
- Light / dark theme toggle
- Modal detail views for stats
- Toast notifications

## Project Structure

```
codenscious-workpulse/
├── backend/
│   ├── main.py              # FastAPI app entrypoint
│   ├── core/                # config, constants
│   ├── db/                  # database engine + CRUD
│   ├── models/              # SQLAlchemy models
│   ├── routes/              # API routes (chat, admin, report)
│   ├── schema/              # Pydantic schemas
│   ├── services/            # LangGraph flow, LLM, vector store
│   └── utils/               # logger, helpers
└── frontend/
    ├── src/
    │   ├── components/ui/   # Reusable UI (Button, Card, Modal, etc)
    │   ├── context/         # ThemeContext
    │   ├── lib/             # utils (cn)
    │   ├── pages/           # AdminDashboard
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── Dashboard.jsx
    │   └── Chat.jsx
    └── tailwind.config.js
```

## Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate     # Windows
pip install -r requirements.txt

# Configure environment
copy .env.example .env    # then edit .env with your keys

uvicorn main:app --reload
```

Backend runs at `http://127.0.0.1:8000`.

### Frontend

```bash
cd frontend
npm install

# Configure environment
copy .env.example .env    # then edit .env with your Firebase config

npm run dev
```

Frontend runs at `http://localhost:5173`.

## Environment Variables

### Backend (`.env`)
- `DATABASE_URL` — PostgreSQL connection string
- `OPENAI_API_KEY` — for LLM + embeddings
- `GEMINI_API_KEY` — optional fallback
- `ADMIN_ID` / `ADMIN_PASSWORD` — admin panel access

### Frontend (`.env`)
- `VITE_FIREBASE_*` — Firebase project config
- `VITE_API_BASE` — backend URL

## API Endpoints

### Employee Chat
- `POST /chat/start` — start a standup session
- `POST /chat/message` — send a message
- `POST /chat/end` — submit final mood + summary

### Admin
- `POST /admin/login` — authenticate admin
- `GET /admin/dashboard` — aggregated stats
- `POST /admin/chat` — RAG query on employee data
- `GET /admin/employees` — list all employees
- `GET /admin/today-reports` — today's reports
- `GET /admin/help-requests` — help needed detail
- `GET /admin/blockers/{risk}` — blockers by risk level
- `GET /admin/mood/{mood}` — reports by mood

## Roadmap

- [x] Employee analytics dashboard (streak, mood trend, task completion, reports history)
- [x] Marketing site (Landing, Features, Pricing, About, Contact, FAQ, Privacy, Terms)
- [x] Pricing tiers (Free / Growth / Pro / Enterprise) with detailed comparison table
- [x] Onboarding tour (first-login guided walkthrough)
- [x] Admin search + filters (mood, risk, help, date range)
- [x] Public Roadmap page (Shipped / In Progress / Planned)
- [x] Live Demo Mode (no login, pre-populated data)
- [x] Global keyboard shortcuts (Cmd+K palette, Cmd+/ help)
- [x] Markdown-rich chat messages (Standup + RAG assistant)
- [x] AI Sentiment Analysis (score, label, stress/frustration/excitement signals)
- [x] Blocker Resolution Suggestions (RAG-powered from past standups)
- [x] Referral program (1 month free per paid conversion)
- [ ] Multi-tenancy (organizations)
- [ ] Subscription/billing (Razorpay)
- [ ] WhatsApp Business API integration
- [ ] Slack integration
- [ ] Email reminders
- [ ] Data export (CSV/PDF)
- [ ] Team hierarchy / managers
- [ ] Mobile app

## Employee Analytics Endpoints

- `GET /employee/{emp_id}/stats` — overview stats (streak, completion, mood, blockers)
- `GET /employee/{emp_id}/mood-trend?days=` — mood score over time
- `GET /employee/{emp_id}/task-breakdown?days=` — task status counts + hours
- `GET /employee/{emp_id}/reports?page=&limit=` — paginated history
- `GET /employee/{emp_id}/report/{id}` — single report + tasks
- `GET /employee/{emp_id}/recent-tasks?limit=&status=` — filtered tasks

## License

Proprietary © Codenscious
