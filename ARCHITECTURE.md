# Architecture

> High-level system design. See also `docs/design-notes.md` and `project-notes/project-memory.md`.

## System Overview

```
┌─────────────────────┐     HTTP/JSON      ┌─────────────────────────┐
│  React SPA (Vite)   │ ◄────────────────► │  ASP.NET Core Web API   │
│  localhost:5173     │   Bearer JWT       │  localhost:5000         │
└─────────────────────┘                    └───────────┬─────────────┘
                                                       │
                                                       ▼
                                           ┌─────────────────────────┐
                                           │  EF Core + SQLite       │
                                           │  learningdashboard.db   │
                                           └─────────────────────────┘
```

## Authentication

- **Login**: `POST /api/auth/login` → JWT (HS256)
- **Storage**: Frontend `sessionStorage`; secret in `appsettings.Development.json` or `Jwt__Key` env var
- **Roles**: `Admin` (full CRUD + dashboard), `User` (own tasks + status PATCH only; cannot create tasks)

## Backend Layers

```
Controllers  →  Services  →  Repositories  →  AppDbContext
                    ↓
              DTOs + FluentValidation
```

| Layer | Responsibility |
|-------|----------------|
| **Controllers** | HTTP routing, status codes, `[Authorize]` (`AuthController`, `TasksController`, `DashboardController`, `UsersController`) |
| **Services** | Business rules, DTO mapping, owner validation, activity logging |
| **Repositories** | EF queries; dashboard counts; activity log persistence |
| **DbContext** | Entities, migrations, seed users (`Users`, `ProjectTasks`, `ActivityLogs`) |

## Frontend Structure

```
App (ThemeProvider + AuthProvider + Router + ToastProvider)
├── /login → LoginPage
├── ProtectedRoute
│   └── Layout (sidebar + logout + role-based nav)
│       ├── DashboardPage (Admin: full; User: task list only)
│       ├── CreateTaskPage → TaskForm (Admin only)
│       └── TaskDetailPage → TaskForm (read-only for User) + ActivityHistory
```

| Module | Role |
|--------|------|
| `src/api/` | HTTP client with JWT Bearer; `auth.ts` for login |
| `src/context/AuthContext.tsx` | Login/logout, role helpers, token persistence |
| `src/components/ui/` | Avatar, Skeleton, ThemeToggle |
| `src/components/dashboard/` | Charts, insights, activity panels |
| `src/context/ThemeContext.tsx` | Light/dark mode (`localStorage`) |
| `src/utils/dashboardAnalytics.ts` | Insights/charts computed from task data |

## Data Model

- **User** (seeded): id, name, email, role, passwordHash? (BCrypt for auth users)
- **ProjectTask**: id, title, description, category, priority, status, ownerId, dueDate, createdAt, updatedAt
- **ActivityLog** (stretch): id, taskId, action, previousValue, newValue, user, timestamp
- **Notification** (stretch): id, recipientUserId, taskId, message, type, isRead, createdAt

## Key Business Rules

- **Dashboard counts**: Always from `GET /api/dashboard/summary` (EF queries, never hardcoded)
- **Overdue**: `dueDate < today (UTC)` AND `status ≠ Completed`
- **Validation**: FluentValidation (backend) + form validation (frontend)
- **Activity log**: Written on task create/update/status change; `GET /api/tasks/{id}/activity`
- **Notifications**: Assign → owner; start/complete → Admin role users; inbox via `/api/notifications`

## Git Branch Architecture

```
main          ← stable; initial commit only baseline (413947a)
  └── dev     ← integration branch; never commit directly to main
        └── feature/<task-name>  ← all new work
```

## Test Architecture

- **Backend**: xUnit + `WebApplicationFactory`, SQLite test DB (29 tests)
- **Frontend**: Vitest + RTL, mocked API modules (NotificationBell + existing page tests)

---

*Last updated: 2026-07-13 — feature/task-notifications*
