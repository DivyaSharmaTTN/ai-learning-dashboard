# Test Strategy

## Goals

Verify core user flows and business rules required by the assessment:

1. Create task → appears in list
2. Update task/status → persisted
3. Dashboard counts reflect database state
4. Validation rejects invalid input

## Backend (xUnit)

### Test Project

`backend/AiLearningDashboard.Api.Tests/`

### Approach

- **Integration tests** using `WebApplicationFactory<Program>` with in-memory or SQLite test database.
- Tests hit real HTTP endpoints (no mocking of DbContext for core flows).

### Test Cases

| ID | Test | Type |
|----|------|------|
| BT-01 | POST `/api/tasks` with valid body returns 201 | Integration |
| BT-02 | POST with empty title returns 400 | Integration |
| BT-03 | POST with invalid ownerId returns 400 | Integration |
| BT-04 | GET `/api/tasks` returns created task | Integration |
| BT-05 | PUT `/api/tasks/{id}` updates fields | Integration |
| BT-06 | PATCH status to InProgress | Integration |
| BT-07 | GET dashboard summary after create reflects total +1 | Integration |
| BT-08 | Overdue count excludes completed tasks with past due date | Unit/Integration |
| BT-09 | High priority count matches DB | Integration |

### Running

```bash
cd backend
dotnet test
```

## Frontend (Vitest + React Testing Library)

### Test Location

`frontend/src/**/*.test.tsx`

### Approach

- Mock `fetch` or API module functions.
- Render pages/components; simulate user events with `@testing-library/user-event`.
- Assert DOM updates and API calls.

### Test Cases

| ID | Test | Type |
|----|------|------|
| FT-01 | CreateTaskPage submits form and shows success | Component |
| FT-02 | TaskList renders tasks from API mock | Component |
| FT-03 | TaskList shows empty state when no tasks | Component |
| FT-04 | SummaryCards display counts from API | Component |
| FT-05 | Status quick action calls PATCH endpoint | Component |
| FT-06 | Form shows validation errors for empty title | Component |
| FT-07 | Error state shown when API fails | Component |

### Running

```bash
cd frontend
npm test
```

## Coverage Targets

- **Backend**: All controllers' happy paths + main validation failures.
- **Frontend**: Dashboard page, task form, list — core flows only (not 100% coverage).

## Edge Cases

| Case | Expected |
|------|----------|
| Task due today | Not overdue |
| Task due yesterday, InProgress | Overdue |
| Task due yesterday, Completed | Not overdue |
| Search with no matches | Empty state |
| Invalid task id in URL | Error/404 UI |

## CI (Future)

```yaml
# Suggested GitHub Actions (not in scope for MVP)
- dotnet test
- npm ci && npm test
```

## Traceability

Test additions logged in `project-notes/testing-log.md` with date and files.

---

## History — 2026-07-13 — feature/task-notifications

### Backend (`NotificationsApiTests`)

| ID | Case |
|----|------|
| NT-01 | Assign task → User receives TaskAssigned message |
| NT-02 | User starts task → Admin receives TaskStarted message |
| NT-03 | User completes task → Admin receives TaskCompleted message |
| NT-04 | Mark one as read updates `isRead` |
| NT-05 | Mark all as read clears unread count |
| NT-06 | Mark another user's notification → 403 |
| NT-07 | Unauthenticated GET → 401 |

### Frontend (`NotificationBell.test.tsx`)

| ID | Case |
|----|------|
| NFT-01 | Unread badge when count > 0 |
| NFT-02 | Dropdown lists notifications |
| NFT-03 | Click navigates to `/tasks/:id` and marks read |
| NFT-04 | Mark all as read |
