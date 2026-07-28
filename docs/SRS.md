# Software Requirements Specification (SRS)

**Product:** TicketFlow – Ticket Management System  
**Version:** 0.1.0 (Phase 1)  
**Date:** 2026-07-21

## 1. Introduction

### 1.1 Purpose

This SRS defines functional and non-functional requirements for TicketFlow, a multi-workspace ticket management SaaS application with projects, issues, Kanban, dashboards, reports, and real-time notifications.

### 1.2 Scope

TicketFlow enables teams to:

- Authenticate securely (JWT + refresh tokens)
- Organize work in workspaces and projects
- Track issues with status, priority, labels, assignees, comments, and attachments
- Manage work on a Kanban board
- View dashboards and export reports
- Receive real-time notifications

### 1.3 Definitions

| Term | Meaning |
|------|---------|
| Workspace | Top-level tenant for a team/org |
| Project | Container of issues within a workspace |
| Issue | Work item (ticket/bug/task) |
| RBAC | Role-based access control |

## 2. Overall description

### 2.1 Product perspective

Client–server SPA:

- **Frontend:** React SPA (Vite)
- **Backend:** REST API (Express) + Socket.IO
- **Database:** MongoDB

### 2.2 User classes

| Role | Capabilities (high level) |
|------|---------------------------|
| Super Admin | Platform-level administration |
| Admin / Owner | Workspace & project administration |
| Member | Create/update issues, comment, board actions |
| Viewer | Read-only access |

### 2.3 Assumptions

- Users have a modern browser
- MongoDB is available
- Email delivery configured for password reset / invites (Phase 2+)

## 3. Functional requirements (by phase)

### Phase 1 – Setup (implemented)

- FR-1.1 Standardized API success/error envelope
- FR-1.2 Light/Dark theme toggle
- FR-1.3 Axios client with auth header & refresh hook
- FR-1.4 Health check endpoint

### Phase 2 – Authentication (planned)

- FR-2.1 Register / Login
- FR-2.2 JWT access + refresh tokens
- FR-2.3 Forgot / reset password
- FR-2.4 Protected routes & RBAC

### Phase 3 – Workspace

- FR-3.1 Create workspace, invite members, roles, settings

### Phase 4 – Projects

- FR-4.1 CRUD, archive, members, project dashboard

### Phase 5 – Issues

- FR-5.1 CRUD issues, labels, priority, status, due date, attachments, assignee, comments, activity log

### Phase 6 – Kanban

- FR-6.1 Drag-and-drop, columns, quick edit, filters, search

### Phase 7 – Dashboard

- FR-7.1 Summary cards, charts, sprint progress, activity, workload

### Phase 8 – Reports

- FR-8.1 Status, burndown, priority, productivity, CSV/PDF export

### Phase 9 – Notifications

- FR-9.1 Socket.IO, toast, notification center

### Phase 10 – Production

- FR-10.1 Audit logs, Cloudinary, email, profile, command palette, Docker, CI/CD

## 4. Non-functional requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | TypeScript on frontend and backend |
| NFR-2 | API responses follow a consistent envelope |
| NFR-3 | Secrets via environment variables |
| NFR-4 | ESLint + Prettier enforced |
| NFR-5 | Responsive UI (desktop + mobile) |

## 5. Related documents

- [HLD](./HLD.md)
- [LLD](./LLD.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [API Overview](./API.md)

## 6. Revision history

| Version | Date | Notes |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Phase 1 scaffold |
