# API Overview

**Base URL:** `/api/v1`  
**Format:** JSON envelope (see README)

## Phase 1

### `GET /health`

Health check for the API process.

**Response `200`**

```json
{
  "success": true,
  "message": "API is healthy",
  "data": {
    "status": "ok",
    "timestamp": "2026-07-21T00:00:00.000Z",
    "uptime": 12.34,
    "environment": "development"
  }
}
```

## Phase 2 – Authentication

All auth responses use the standard envelope. Validation errors return `400` with `errors[]`.

### `POST /auth/register`

Create a new account. The first user in the database receives the `super_admin` role.

**Body**

```json
{
  "email": "user@example.com",
  "password": "SecurePass1",
  "firstName": "Jane",
  "lastName": "Doe"
}
```

**Response `201`**

```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "firstName": "Jane",
      "lastName": "Doe",
      "role": "member"
    },
    "accessToken": "<jwt>",
    "refreshToken": "<opaque>"
  }
}
```

### `POST /auth/login`

**Body:** `{ "email", "password" }`  
**Response `200`:** Same shape as register `data`.

### `POST /auth/refresh`

Rotate refresh token and issue a new access token.

**Body:** `{ "refreshToken": "<opaque>" }`

**Response `200`**

```json
{
  "success": true,
  "data": {
    "accessToken": "<jwt>",
    "refreshToken": "<opaque>"
  }
}
```

### `POST /auth/logout`

Revoke a refresh token.

**Body:** `{ "refreshToken": "<opaque>" }`

### `POST /auth/forgot-password`

Always returns success (no email enumeration). Sends reset email when SMTP is configured; in development without SMTP, logs the reset URL to the server console.

**Body:** `{ "email": "user@example.com" }`

### `POST /auth/reset-password`

**Body:** `{ "token": "<from email link>", "password": "NewSecurePass1" }`

### `GET /auth/me`

Requires header: `Authorization: Bearer <accessToken>`

**Response `200`:** User object in `data`.

### `GET /auth/admin/ping`

Requires `super_admin` or `admin` role. Example RBAC-protected route.

## Phase 3+ (planned)

| Method | Path | Description |
|--------|------|-------------|
| CRUD | `/workspaces` | Workspace management |
| CRUD | `/projects` | Project management |
| CRUD | `/issues` | Issue management |

OpenAPI / Swagger will be added in a later phase (`/api/docs`).
