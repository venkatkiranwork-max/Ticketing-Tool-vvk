# Database Schema (draft)

**Product:** TicketFlow  
**Version:** 0.1.0  
**Store:** MongoDB (Mongoose)

> Collections below are planned for Phases 2–10. Phase 1 has no domain models yet.

## Users

| Field | Type | Notes |
|-------|------|--------|
| email | String | unique, required |
| passwordHash | String | bcrypt |
| firstName | String | |
| lastName | String | |
| role | Enum | super_admin, admin, member, viewer |
| avatarUrl | String | optional |
| resetPasswordToken | String | optional |
| resetPasswordExpires | Date | optional |
| timestamps | | createdAt, updatedAt |

## RefreshTokens

| Field | Type | Notes |
|-------|------|--------|
| userId | ObjectId → User | |
| tokenHash | String | |
| expiresAt | Date | |
| revoked | Boolean | |

## Workspaces

| Field | Type | Notes |
|-------|------|--------|
| name | String | |
| slug | String | unique |
| ownerId | ObjectId → User | |
| settings | Object | |

## WorkspaceMembers

| Field | Type | Notes |
|-------|------|--------|
| workspaceId | ObjectId | |
| userId | ObjectId | |
| role | Enum | owner, admin, member, viewer |

## Projects

| Field | Type | Notes |
|-------|------|--------|
| workspaceId | ObjectId | |
| name | String | |
| key | String | e.g. TMS |
| description | String | |
| status | Enum | active, archived |
| members | [ObjectId] | |

## Issues

| Field | Type | Notes |
|-------|------|--------|
| projectId | ObjectId | |
| number | Number | per-project sequence |
| title | String | |
| description | String | |
| status | String / ObjectId | board column |
| priority | Enum | lowest…highest |
| labels | [String/ObjectId] | |
| assigneeId | ObjectId | |
| reporterId | ObjectId | |
| dueDate | Date | |
| attachments | [Object] | Cloudinary refs |
| archived | Boolean | |

## Comments / ActivityLogs / Notifications

Defined in later phases with indexes on `issueId`, `userId`, `createdAt`.

## Indexes (planned)

- `users.email` unique
- `workspaces.slug` unique
- `issues.projectId + number` unique
- `issues.projectId + status`
- `workspaceMembers.workspaceId + userId` unique
