# Specification (Cursor Workflow)

## Product

Small dashboard for learning goals and project tasks.

## Entities

### User (seeded)

`id`, `name`, `email`, `role`

### ProjectTask

`id`, `title`, `description`, `category`, `priority`, `status`, `ownerId`, `dueDate`, `createdAt`, `updatedAt`

### ActivityLog (stretch — implemented)

`id`, `taskId`, `action`, `previousValue`, `newValue`, `user`, `timestamp`

## Enums

- **Priority**: Low, Medium, High
- **Status**: NotStarted, InProgress, Completed
- **Category**: Learning, Project, Certification, Other

## Features (Must Have)

1. Create task from UI
2. Dashboard summary cards (5 counts from DB)
3. List all tasks
4. Task detail view
5. Update all task fields
6. Mark In Progress
7. Mark Completed
8. Keyword search OR status filter (extended stretch: priority, category, pagination)
9. SQLite persistence
10. Required field validation (BE + FE)
11. Loading, empty, success, error UI states
12. Core tests (BE + FE)

## Dashboard Counts

| Card | Rule |
|------|------|
| Total | All tasks |
| Completed | status = Completed |
| In Progress | status = InProgress |
| Overdue | dueDate < today AND status ≠ Completed |
| High Priority | priority = High |

## API Endpoints

- GET/POST `/api/tasks`
- GET/PUT `/api/tasks/{id}`
- PATCH `/api/tasks/{id}/status`
- GET `/api/tasks/{id}/activity` (stretch: audit history)
- GET `/api/notifications` (+ unread-count, mark read, mark all read)
- GET `/api/dashboard/summary`
- GET `/api/users`

## Frontend Components

DashboardPage, SummaryCards, TaskList, TaskDetailPage, TaskForm, SearchFilter, TaskPagination, ActivityHistory, NotificationBell, LoadingState, EmptyState, ErrorState, Toast

## Documentation Requirements

All files under `/docs`, `/project-notes`, `/ai-prompts`, `/tool-specific/cursor-workflow`, and `.cursor/rules` must stay synchronized with code. **Append** history; never overwrite prior entries (see `.cursor/rules/git-workflow.mdc`).

---

## History

| Date | Change |
|------|--------|
| 2026-07-03 | Initial spec |
| 2026-07-09 | ActivityLog entity, activity API, ActivityHistory; git-workflow doc rules |
| 2026-07-09 | Extended task filters (priority, category) and paginated GET /api/tasks |
| 2026-07-09 | JWT auth + RBAC: login API, Admin/User roles, protected routes |
| 2026-07-09 | Auth UI review: Admin-only task creation documented; login page redesign |
| 2026-07-13 | In-app notifications: Notification entity, APIs, NotificationBell dropdown |
