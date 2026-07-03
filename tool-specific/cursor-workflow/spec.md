# Specification (Cursor Workflow)

## Product

Small dashboard for learning goals and project tasks.

## Entities

### User (seeded)

`id`, `name`, `email`, `role`

### ProjectTask

`id`, `title`, `description`, `category`, `priority`, `status`, `ownerId`, `dueDate`, `createdAt`, `updatedAt`

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
8. Keyword search OR status filter
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
- GET `/api/dashboard/summary`
- GET `/api/users`

## Frontend Components

DashboardPage, SummaryCards, TaskList, TaskDetailPage, TaskForm, SearchFilter, LoadingState, EmptyState, ErrorState, Toast

## Documentation Requirements

All files under `/docs`, `/project-notes`, `/ai-prompts`, `/tool-specific/cursor-workflow` must stay synchronized with code.
