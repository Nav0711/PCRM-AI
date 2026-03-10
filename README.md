# P-CRM + AI Co-Pilot for Politicians

**P-CRM + AI Co-Pilot** is a unified digital command center built for political offices in India. It empowers MLAs, MPs, Municipal Councillors, and political party war rooms by combining a **Smart Political CRM** for citizen grievance management with an **AI Co-Pilot** providing real-time intelligent briefings, communications drafts, and actionable constituency insights.

![Status: Active Development](https://img.shields.io/badge/Status-Active%20Development-blue.svg)
![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)

---

## 📖 Table of Contents
- [Executive Summary](#-executive-summary)
- [✨ Key Features](#-key-features)
- [🏗 Architecture & Tech Stack](#-architecture--tech-stack)
- [📂 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [📦 Environment Variables](#-environment-variables)
- [👥 User Personas](#-user-personas)

---

## 🎯 Executive Summary

Political offices often manage thousands of citizen grievances via fragmented, manual processes (WhatsApp, physical registers, walk-ins). 
**P-CRM + AI Co-Pilot** replaces this chaos with an omnichannel intake system, AI-powered classification, auto-routing, real-time tracking dashboards, and a specialized conversational AI assistant trained directly on constituency data.

It serves two primary interfaces:
1. **P-CRM (Staff Interface):** A comprehensive web dashboard for office staff (PAs, ward workers) to manage the full lifecycle of citizen grievances.
2. **AI Co-Pilot (Politician Interface):** A personal AI panel delivering daily data-driven auto-briefings and a conversational chat interface for the politician.

---

## ✨ Key Features

- **Omnichannel Grievance Intake:** Accept citizen complaints via Web Form, WhatsApp Bot, and Voice Calls (with Bhashini/Whisper AI transcription).
- **AI Classification & Routing:** Automatically classify, prioritize (1-5 scale), summarize, and assign incoming complaints using Anthropic's Claude API.
- **Staff CRM Dashboard:** Real-time SLA tracking, ticket management, team performance monitoring, and ward-level heatmaps.
- **Workflow & Assignment Engine:** Rules-based lifecycle management with automated SLA breach escalations & SMS triggers.
- **AI Co-Pilot (Morning Briefing):** Auto-generated daily intelligence briefing ready by 7 AM, highlighting urgent cases, trends, and bottlenecks.
- **AI Co-Pilot (Conversational Panel):** Natural language querying of constituency data, intelligent speech/statement drafting, and media response generation.
- **Citizen Transparency:** Automated SMS/WhatsApp updates to citizens at every stage of the grievance resolution journey.

---

## 🏗 Architecture & Tech Stack

This project uses a modern monorepo structure with a decoupled Frontend and Backend.

**Frontend (React/Vite)**
- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand
- **Real-time & Maps:** WebSockets, Leaflet.js, Recharts

**Backend (FastAPI)**
- **Framework:** FastAPI (Python 3.11)
- **Database:** PostgreSQL (via Supabase)
- **ORM:** SQLAlchemy 2.0 + Alembic
- **Task Queue:** Celery + Redis
- **Authentication:** JWT + bcrypt
- **AI/ML Integration:** Claude API (classification/drafting), Bhashini/Whisper API (ASR)

---

## 📂 Project Structure

```
pcrmAI/
├── backend/                  # FastAPI Backend
│   ├── alembic/              # Database Migrations
│   ├── models/               # SQLAlchemy DB Models
│   ├── routers/              # API Endpoints (Auth, Complaints, Copilot)
│   ├── schemas/              # Pydantic Schemas
│   ├── services/             # Core Business Logic (AI, Auth, SMS, WhatsApp)
│   ├── utils/                # DB, Dependencies, Security
│   ├── celery_app.py         # Celery Worker Config
│   └── main.py               # FastAPI App Entrypoint
├── docs/                     # Documentation (including PRD.md)
└── frontend/                 # React Frontend
    ├── public/               # Static Assets
    ├── src/                  # React Source Code
    │   ├── components/       # Reusable UI & AI Components
    │   ├── contexts/         # React Contexts (Auth, AI Chat)
    │   ├── hooks/            # Custom React Hooks
    │   ├── layouts/          # Role-based Layouts
    │   ├── pages/            # View Components
    │   ├── services/         # API & AI Clients
    │   └── types/            # TypeScript Interfaces
    └── vite.config.ts        # Vite Configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+) and Bun/pnpm
- Python 3.11+
- PostgreSQL
- Redis

### 1. Clone the project
```bash
git clone <repository-url>
cd pcrmAI
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt

# Run initial migrations
alembic upgrade head

# Start the FastAPI server
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
# Install dependencies (using bun or npm/pnpm)
bun install

# Start the development server
bun run dev
```

### 4. Background Workers (Celery)
In a separate terminal window inside the `backend` folder:
```bash
celery -A celery_app worker --loglevel=info
```

---

## 📦 Environment Variables

Create `.env` files in both `frontend/` and `backend/` directories.

**Backend (`backend/.env`):**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/pcrm
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your_super_secret_jwt_key
CLAUDE_API_KEY=your_anthropic_api_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
MSG91_AUTH_KEY=your_msg91_key
```

**Frontend (`frontend/.env`):**
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

---

## 👥 User Personas

1. **The Politician (MLA/MP):** Uses the AI Co-Pilot for daily briefings and fast decision-making without touching the CRM.
2. **The PA / Chief of Staff:** Uses the P-CRM dashboard to centrally manage grievances, assignment, and team workflows.
3. **The Ward Worker / Field Staff:** Gets targeted mobile assignments and status-update workflows.
4. **The Citizen:** Enjoys frictionless grievance submission and real-time status updates via WhatsApp and web.