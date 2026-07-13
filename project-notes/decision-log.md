# Decision Log

> Append-only engineering decisions.

---

## DL-001 — SQLite over SQL Server

| Field | Value |
|-------|-------|
| **Decision** | Use SQLite with EF Core |
| **Why chosen** | No external DB install; single file persistence; sufficient for assessment |
| **Alternative considered** | SQL Server LocalDB |
| **Trade-off** | Less production-like; simpler ops |
| **Impact** | `learningdashboard.db` file; connection string in `appsettings.json` |
| **Date** | 2026-07-03 |

---

## DL-002 — Vite + React TypeScript

| Field | Value |
|-------|-------|
| **Decision** | Scaffold frontend with Vite React TS template |
| **Why chosen** | Fast HMR, standard modern stack, Vitest integration |
| **Alternative considered** | Create React App, Next.js |
| **Trade-off** | No SSR (not needed) |
| **Impact** | `frontend/` with `vite.config.ts` |
| **Date** | 2026-07-03 |

---

## DL-003 — Dashboard counts from service layer

| Field | Value |
|-------|-------|
| **Decision** | `DashboardService` queries EF for all five counts |
| **Why chosen** | Assessment forbids hardcoded counts; single source of truth |
| **Alternative considered** | Frontend-side counting from task list |
| **Trade-off** | Extra API call; accurate for large lists |
| **Impact** | `GET /api/dashboard/summary` |
| **Date** | 2026-07-03 |

---

## DL-004 — Documentation-first workflow

| Field | Value |
|-------|-------|
| **Decision** | Create all doc scaffolding before application code |
| **Why chosen** | Assessment requires traceability; empty repo |
| **Alternative considered** | Code first, docs later |
| **Trade-off** | Slower initial velocity |
| **Impact** | All `/docs` and `/project-notes` files exist early |
| **Date** | 2026-07-03 |

---

## DL-005 — Git branch workflow

| Field | Value |
|-------|-------|
| **Decision** | `main` (stable) → `dev` (integration) → `feature/<task>` (work) |
| **Why chosen** | Assessment requires meaningful branch history; protects initial commit on `main` |
| **Alternative considered** | Trunk-based development on `main` only |
| **Trade-off** | Extra merge steps; clearer traceability |
| **Impact** | All agents and contributors branch from `dev`; documented in README, ARCHITECTURE, TASKS |
| **Date** | 2026-07-03 |

---

## DL-006 — Activity log user attribution without auth

| Field | Value |
|-------|-------|
| **Decision** | Store task owner name in `ActivityLog.User` until JWT stretch is implemented |
| **Why chosen** | Auth is a separate stretch item; owner is the best available actor identity today |
| **Alternative considered** | Hardcode "System"; defer activity log until auth |
| **Trade-off** | User field does not reflect who performed the action in multi-user scenarios |
| **Impact** | `TaskService` passes `existing.Owner?.Name ?? "System"` to activity logger |
| **Date** | 2026-07-09 |

---

## DL-007 — Canonical Cursor Rule Location

| Field | Value |
|-------|-------|
| **Decision** | Single source of truth at `.cursor/rules/git-workflow.mdc` with `alwaysApply: true` |
| **Why chosen** | Cursor loads rules from repo-root `.cursor/rules/`; avoids drift from duplicate copies |
| **Alternative considered** | Rule only under `ai-prompts/.cursor/rules/` |
| **Trade-off** | `ai-prompts/.cursor` copy is a pointer only |
| **Impact** | All agents append history to project-notes, ai-prompts, cursor-workflow on every change |
| **Date** | 2026-07-09 |

---

*Append new decisions below.*

---

## DL-008 — JWT Auth with Role on User Entity

| Field | Value |
|-------|-------|
| **Decision** | Add `PasswordHash` to existing `User` table; use `Role` column for ASP.NET roles (`Admin`, `User`) |
| **Why chosen** | Minimal schema change; preserves legacy seed users and task owner FKs |
| **Alternative considered** | Separate `AuthUser` table or ASP.NET Identity |
| **Trade-off** | `Role` mixes job titles (Developer) and auth roles (Admin) |
| **Impact** | `[Authorize(Roles = "Admin")]` on dashboard/users/create endpoints |
| **Date** | 2026-07-09 |

---

## DL-009 — User Role Cannot Create Tasks (By Design)

| Field | Value |
|-------|-------|
| **Decision** | Task creation (`POST /api/tasks`) and full edit remain Admin-only; User sees role-specific empty state |
| **Why chosen** | Original stretch requirement: "User: View assigned tasks and update only their task status" |
| **Alternative considered** | Allow User to create tasks |
| **Trade-off** | Users depend on Admin for new assignments |
| **Impact** | Frontend hides create nav/actions for User; empty state says "Contact an admin" |
| **Date** | 2026-07-09 |

---

## DL-010 — In-App Notifications Separate from ActivityLog

| Field | Value |
|-------|-------|
| **Decision** | New `Notification` entity + inbox APIs; do not reuse `ActivityLog` |
| **Why chosen** | ActivityLog is task-scoped audit with actor name string; notifications need recipient, isRead, and inbox queries |
| **Alternative considered** | Derive inbox from ActivityLog; SignalR push |
| **Trade-off** | Two related persistence paths; frontend polls unread count every 30s instead of realtime |
| **Impact** | `TaskService` writes both activity and notifications on assign/status changes |
| **Date** | 2026-07-13 |
