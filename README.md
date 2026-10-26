# AI-Assisted UAV Flight Operations and Health Monitoring Management System

Academic software engineering project — a centralized platform for UAV
registration, mission planning, telemetry monitoring, AI-assisted health
prediction, alerts, and predictive maintenance.

## Status: Phase 1 — Project Foundation (complete)

This phase sets up the skeleton only. No auth, telemetry, AI prediction,
or dashboard yet — those come in later phases per the build plan.

## Architecture

```
Frontend (React) --> Backend API (Node/Express) --> Database (PostgreSQL)
                              |
                       AI Service (FastAPI)
                              |
                    Telemetry Simulator (Python)
```

The frontend never talks to the database directly — everything goes
through the backend API.

## Folder structure

```
uav-health-monitoring-system/
├── frontend/          React app (Vite)
├── backend/            Node/Express API
├── ai-service/          Python/FastAPI AI microservice
├── database/            schema.sql, seed.sql, migrations
├── telemetry-simulator/ Python telemetry generator (Phase 9)
├── docs/                 SRS, diagrams, project documentation
├── tests/
└── README.md
```

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+ and pip
- PostgreSQL 14+ (local install, or a free Neon.tech/Supabase instance)

## Setup — Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env and set DATABASE_URL to your own Postgres connection string
npm start
```

Verify: open `http://localhost:5000/api/health` — expected response:

```json
{ "status": "OK", "message": "UAV Health Monitoring System API is running" }
```

## Setup — AI Service

```bash
cd ai-service
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Verify: open `http://localhost:8000/health`

## Setup — Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` — it should show "Backend status: UAV Health
Monitoring System API is running" once the backend is also running.

## Database

PostgreSQL is used via a plain connection string (`DATABASE_URL` in
`backend/.env`) through the `pg` npm package — no auth tokens to refresh.
Full schema is created in Phase 2; `database/schema.sql` currently only
contains a placeholder sanity-check table.

## Next phase

Phase 2 — Database: full schema for USERS, UAVS, MISSIONS, TELEMETRY,
HEALTH_RECORDS, AI_PREDICTIONS, ALERTS, MAINTENANCE, FLIGHT_HISTORY,
SYSTEM_LOGS, plus seed data.
