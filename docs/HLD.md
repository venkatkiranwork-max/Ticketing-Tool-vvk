# High-Level Design (HLD)

**Product:** TicketFlow  
**Version:** 0.1.0

## 1. Architecture overview

```
┌─────────────┐     HTTPS/REST      ┌─────────────────┐
│  React SPA  │ ◄─────────────────► │  Express API    │
│  (Vite)     │     Socket.IO       │  (Node/TS)      │
└─────────────┘ ◄─────────────────► └────────┬────────┘
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │   MongoDB   │
                                      └─────────────┘
```

## 2. Frontend layers

- **Pages / Features** – route-level UI
- **Components** – reusable UI
- **API / Services** – Axios + TanStack Query
- **Store** – Zustand (auth, theme, UI)
- **Theme** – MUI + Tailwind + CSS variables

## 3. Backend layers

- **Routes** → Controllers → Services → Repositories → Models
- **Middleware** – auth, RBAC, validation, errors
- **Utils** – API envelope, AppError helpers
- **Socket** – realtime (Phase 9)

## 4. Cross-cutting

- JWT access (short-lived) + refresh (long-lived)
- Centralized error handler
- CORS locked to `CLIENT_URL`
- Helmet + Morgan

## 5. Deployment (Phase 10)

- Docker Compose: frontend, backend, MongoDB
- CI: lint, typecheck, build
- Secrets via environment / platform vault
