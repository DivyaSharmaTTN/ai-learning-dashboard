# Design Notes

## UI/UX Approach

- **Layout**: Single-column responsive dashboard with summary cards at top, filters below, task list as primary content.
- **Navigation**: Top nav with app title, "Dashboard", and "New Task" action.
- **Visual hierarchy**: Summary cards use color accents (neutral total, green completed, blue in-progress, red overdue, amber high-priority).
- **Task list**: Card or table rows with quick actions (Start, Complete) for common status transitions.
- **Forms**: Single reusable `TaskForm` for create and edit; owner dropdown populated from `/api/users`.

## Component Architecture (Frontend)

```
App
├── Layout (nav, toast provider)
├── DashboardPage
│   ├── SummaryCards
│   ├── SearchFilter
│   ├── TaskList
│   │   └── TaskListItem
│   ├── LoadingState
│   ├── EmptyState
│   └── ErrorState
├── TaskDetailPage
│   └── TaskForm (read/edit mode)
├── CreateTaskPage
│   └── TaskForm
└── Toast / SuccessMessage
```

## State Management

- **Local component state** with `useState` / `useEffect` for MVP (no Redux required).
- **Refetch pattern**: After mutation, call `loadTasks()` and `loadSummary()` to keep dashboard accurate.
- **API module**: Centralized `api/tasks.ts`, `api/dashboard.ts`, `api/users.ts`.

## Backend Layering

```
Controllers → Services → Repositories → DbContext
                ↓
            DTOs + Validators
```

- Controllers stay thin (HTTP concerns only).
- Business rules (overdue calculation) live in `DashboardService`.
- Validation via FluentValidation validators on DTOs.

## Database

- **SQLite** file `learningdashboard.db` in API project directory (gitignored).
- **Seed data**: 3–4 users with roles (Developer, Learner, Lead).
- **Timestamps**: `CreatedAt` set on insert; `UpdatedAt` set on every update (UTC).

## Overdue Calculation

```csharp
// Pseudocode — backend source of truth
overdueCount = tasks.Count(t =>
    t.DueDate.Date < DateTime.UtcNow.Date &&
    t.Status != TaskStatus.Completed);
```

Frontend displays overdue badge using same rule for consistency, but dashboard card uses API count.

## CORS

Allow `http://localhost:5173` in development.

## Error Handling

- API: ProblemDetails (400 validation, 404 not found, 500 unexpected).
- Frontend: Parse error body; show `ErrorState` with message; toast on recoverable errors.

## Styling

- CSS modules or a single `App.css` with CSS variables for a clean, professional look without heavy UI library dependency.
- Optional: minimal custom design system (spacing, radius, shadows).

## Trade-offs

| Decision | Chosen | Alternative | Reason |
|----------|--------|-------------|--------|
| Database | SQLite | SQL Server | Zero install for assessors |
| State | useState | React Query | Simpler for assessment scope |
| Validation | FluentValidation + HTML5 | Only frontend | Meets dual validation requirement |
| Router | React Router | Single page tabs | Clear detail URLs |

## Accessibility (Baseline)

- Semantic HTML (`main`, `nav`, `button`, `label`)
- Form labels associated with inputs
- Loading states announced via `aria-busy` where practical

---

## History — 2026-07-13 — In-app notifications UI

**Branch**: `feature/task-notifications`

- Bell icon in topbar opens a glass-panel dropdown (`NotificationBell`)
- Unread red dot only when unread count > 0
- Clicking a row marks read and navigates to `/tasks/:id`
- “Mark all read” action in dropdown header
- Unread count polled every 30s (no SignalR)
- Styles live in `index.css` under `.notification-*` classes
