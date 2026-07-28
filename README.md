# TicketFlow – Ticket Management System

Full-stack SaaS-style ticket / issue management platform built in phases.

## Stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS, MUI, TanStack Query, Zustand, Axios |
| Backend | Node.js, Express, TypeScript, MongoDB, Mongoose, JWT |
| Realtime | Socket.IO (Phase 9) |
| Infra | Docker, CI/CD (Phase 10) |

## Project structure

```
ticket-management-system/
├── frontend/     # React + Vite SPA
├── backend/      # Express API
├── docs/         # SRS, HLD, LLD, schema, API docs
└── README.md
```

## Phase roadmap

| Phase | Status | Scope |
|-------|--------|--------|
| 1 | ✅ Done | Project setup, env, lint, theme, Axios, API format |
| 2 | ✅ Done | Auth (JWT, refresh, RBAC, password reset) |
| 3 | ✅ Done | Workspaces & members |
| 4 | ✅ Done | Projects & members |
| 5 | ✅ Done | Issues (CRUD, status, priority, labels) |
| 6 | ✅ Done | Kanban board (drag-and-drop status workflow) |
| 7 | ✅ Done | Dashboard (summary cards, sprint progress, activity) |
| 8 | ✅ Done | Reports (status breakdown, priority distribution, completion rate) |
| 9 | ✅ Done | Notifications (notification center, unread count, mark as read) |
| 10 | ✅ Done | Production (Docker, CI/CD, profile, settings, audit logs) |

## Prerequisites

- Node.js 20+ (22+ recommended)
- MongoDB running locally or a cloud URI
- npm 10+

## Quick start

### 1. Backend

```bash
cd backend
cp .env.example .env   # if needed; .env is already scaffolded for local dev
npm install
npm run dev
```

API: `http://localhost:5000/api/v1`  
Health: `GET /api/v1/health`

### 2. Frontend

```bash
cd frontend
cp .env.example .env   # optional
npm install
npm run dev
```

App: `http://localhost:5173`  
Vite proxies `/api` → `http://localhost:5000`.

## API response format

**Success**

```json
{
  "success": true,
  "message": "Success",
  "data": {},
  "meta": { "page": 1, "limit": 20, "total": 0, "totalPages": 0 }
}
```

**Error**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Invalid email" }]
}
```

## Environment files

Both apps use:

- `.env` – base defaults
- `.env.development` – development overrides
- `.env.local` – local secrets (gitignored)
- `.env.production` – production template
- `.env.example` – documented sample for onboarding

## Scripts

**Backend:** `npm run dev` | `build` | `start` | `lint` | `format`  
**Frontend:** `npm run dev` | `build` | `preview` | `lint` | `format`

## Documentation

See [`docs/`](./docs/) for SRS and design docs (expanded as phases progress).

## License

ISC
