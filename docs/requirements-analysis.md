# Requirements Analysis

## Overview

Build a small dashboard for tracking learning goals and project tasks with ownership, due dates, priority, status, and progress. The application is frontend-heavy but requires a real ASP.NET Core backend with persistent storage.

## Functional Requirements

### Task Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Create project tasks from UI | Must |
| FR-02 | List all tasks | Must |
| FR-03 | View task detail | Must |
| FR-04 | Update task fields (title, description, priority, status, owner, due date) | Must |
| FR-05 | Mark task as In Progress | Must |
| FR-06 | Mark task as Completed | Must |
| FR-07 | Keyword search or status filter | Must |
| FR-08 | Persist data in database across restarts | Must |

### Dashboard

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-09 | Summary cards: Total, Completed, In Progress, Overdue, High Priority | Must |
| FR-10 | Counts from backend/database, not hardcoded | Must |
| FR-11 | Counts update after create/update | Must |
| FR-12 | Overdue = due date before today AND status ≠ Completed | Must |

### Users

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-13 | Seeded users only (no registration UI) | Must |
| FR-14 | User fields: id, name, email, role | Must |

### Validation & UX

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-15 | Required field validation (backend + frontend) | Must |
| FR-16 | Loading state | Must |
| FR-17 | Empty state | Must |
| FR-18 | Success state (toast/message) | Must |
| FR-19 | Error state | Must |

### Testing

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-20 | Create task flow tested | Must |
| FR-21 | Task appears in list | Must |
| FR-22 | Update task/status tested | Must |
| FR-23 | Dashboard counts update correctly | Must |
| FR-24 | Backend validation tests | Must |

## Non-Functional Requirements

- **Tech stack**: React, ASP.NET Core Web API, SQLite/SQL Server + EF Core, xUnit, Vitest/Jest + RTL
- **Code quality**: Clean structure (controllers, DTOs, entities, services, validation)
- **Documentation**: Full traceability (docs, project notes, prompt history)
- **Git**: Meaningful commits on feature branches
- **Security**: No secrets in repository

## Entity Model

### User (seeded)

- `id`, `name`, `email`, `role`

### ProjectTask

- `id`, `title`, `description`, `category`, `priority`, `status`, `ownerId`, `dueDate`, `createdAt`, `updatedAt`

## API Surface (Planned)

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/tasks` | List tasks (optional search/status filter) |
| GET | `/api/tasks/{id}` | Task detail |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/{id}` | Update task |
| PATCH | `/api/tasks/{id}/status` | Update status only |
| GET | `/api/dashboard/summary` | Dashboard counts |
| GET | `/api/users` | Seeded users for owner dropdown |

## Out of Scope (Stretch — Deferred)

- Authentication/authorization
- User creation UI
- File attachments
- Real-time updates (SignalR)
- Pagination (unless list grows large)

## Assumptions

1. SQLite is sufficient for local assessment deployment (no SQL Server license required).
2. Single-tenant usage; seeded users represent team members.
3. Category is a required field on tasks (part of entity spec).
4. Priority enum: `Low`, `Medium`, `High`.
5. Status enum: `NotStarted`, `InProgress`, `Completed`.

## Risks

| Risk | Mitigation |
|------|------------|
| CORS issues between React dev server and API | Configure CORS in `Program.cs` |
| Date/timezone overdue logic | Use UTC date comparison on backend; document behavior |
| Dashboard stale after mutation | Refetch summary and list after create/update |
