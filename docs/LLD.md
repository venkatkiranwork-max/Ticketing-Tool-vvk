# Low-Level Design (LLD)

**Product:** TicketFlow  
**Version:** 0.1.0

## 1. API response helpers

```ts
sendSuccess(res, data, message?, statusCode?, meta?)
sendError(res, message, statusCode?, errors?, stack?)
sendCreated(res, data, message?)
sendPaginated(res, data[], meta, message?)
```

## 2. Error model

| Class | Status |
|-------|--------|
| `BadRequestError` | 400 |
| `UnauthorizedError` | 401 |
| `ForbiddenError` | 403 |
| `NotFoundError` | 404 |
| `ConflictError` | 409 |
| `AppError` | custom |

## 3. Frontend Axios flow

1. Attach `Authorization: Bearer <accessToken>` from `localStorage`
2. On 401 → attempt `/auth/refresh` once
3. Persist new access token or redirect to `/login`

## 4. Theme

- Zustand `themeStore` persists `light` | `dark`
- MUI `createAppTheme(mode)` + Tailwind CSS variables
- Toggle in root layout AppBar

## 5. Module map (upcoming)

| Feature | Frontend | Backend |
|---------|----------|---------|
| Auth | `features/auth` | `routes/auth`, `services/auth` |
| Workspace | `features/settings` | `routes/workspaces` |
| Projects | `features/projects` | `routes/projects` |
| Issues | `features/issues` | `routes/issues` |
| Board | `features/board` | issue status updates |
| Reports | `features/reports` | `routes/reports` |

Detailed sequence diagrams will be added per phase.
