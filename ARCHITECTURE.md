# Architecture

> High-level system design. See also `docs/design-notes.md` and `project-notes/project-memory.md`.

## System Overview

```
┌─────────────────────┐     HTTP/JSON      ┌─────────────────────────┐
│  React SPA (Vite)   │ ◄────────────────► │  ASP.NET Core Web API   │
│  localhost:5173     │                    │  localhost:5000         │
└─────────────────────┘                    └───────────┬─────────────┘
                                                       │
                                                       ▼
                                           ┌─────────────────────────┐
                                           │  EF Core + SQLite       │
                                           │  learningdashboard.db   │
                                           └─────────────────────────┘
```

## Backend Layers

```
Controllers  →  Services  →  Repositories  →  AppDbContext
                    ↓
              DTOs + FluentValidation
```

| Layer | Responsibility |
|-------|----------------|
| **Controllers** | HTTP routing, status codes (`TasksController`, `DashboardController`, `UsersController`) |
| **Services** | Business rules, DTO mapping, owner validation, activity logging |
| **Repositories** | EF queries; dashboard counts; activity log persistence |
| **DbContext** | Entities, migrations, seed users (`Users`, `ProjectTasks`, `ActivityLogs`) |

## Frontend Structure

```
App (ThemeProvider + Router + ToastProvider)
├── Layout (sidebar + theme toggle)
├── DashboardPage
│   ├── SummaryCards (icons, animations)
│   ├── TaskStatusChart / WeeklyProgressChart (Recharts)
│   ├── AiInsights / RecentActivity / UpcomingDeadlines
│   ├── SearchFilter / TaskList / TaskListItem
│   └── DashboardSkeleton (loading)
├── CreateTaskPage → TaskForm
└── TaskDetailPage → TaskForm + ActivityHistory
```

| Module | Role |
|--------|------|
| `src/api/` | HTTP client; no hardcoded dashboard data |
| `src/components/ui/` | Avatar, Skeleton, ThemeToggle |
| `src/components/dashboard/` | Charts, insights, activity panels |
| `src/context/ThemeContext.tsx` | Light/dark mode (`localStorage`) |
| `src/utils/dashboardAnalytics.ts` | Insights/charts computed from task data |

## Data Model

- **User** (seeded): id, name, email, role
- **ProjectTask**: id, title, description, category, priority, status, ownerId, dueDate, createdAt, updatedAt
- **ActivityLog** (stretch): id, taskId, action, previousValue, newValue, user, timestamp

## Key Business Rules

- **Dashboard counts**: Always from `GET /api/dashboard/summary` (EF queries, never hardcoded)
- **Overdue**: `dueDate < today (UTC)` AND `status ≠ Completed`
- **Validation**: FluentValidation (backend) + form validation (frontend)
- **Activity log**: Written on task create/update/status change; `GET /api/tasks/{id}/activity`

## Git Branch Architecture

```
main          ← stable; initial commit only baseline (413947a)
  └── dev     ← integration branch; never commit directly to main
        └── feature/<task-name>  ← all new work
```

## Test Architecture

- **Backend**: xUnit + `WebApplicationFactory`, SQLite test DB (11 tests)
- **Frontend**: Vitest + RTL, mocked API modules (8 tests)

---

*Last updated: 2026-07-09 — activity log stretch*
