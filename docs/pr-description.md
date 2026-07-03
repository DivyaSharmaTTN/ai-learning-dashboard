# Pull Request Description (Template)

Use this when merging feature branches into `dev` or `main`.

---

## Title

`feat: AI Learning Dashboard — full-stack task tracker`

## Summary

- Implements React dashboard for learning/project task tracking
- ASP.NET Core Web API with EF Core SQLite persistence
- Dashboard summary cards with real-time counts from database
- Task CRUD, status updates, search/filter, validation, and UI states
- xUnit and Vitest/RTL tests for core flows
- Full documentation and AI development traceability

## Changes

### Backend

- REST API for tasks, users, dashboard summary
- EF Core entities: `User`, `ProjectTask`
- Seeded users; SQLite database
- FluentValidation on DTOs

### Frontend

- Dashboard with summary cards and task list
- Create/edit task form with owner dropdown
- Task detail view with quick status actions
- Loading, empty, success, and error states
- Keyword search and status filter

### Tests

- Backend integration tests: CRUD, validation, dashboard counts
- Frontend component tests: create, list, update, summary

### Documentation

- `/docs` assessment documentation
- `/project-notes` living logs
- `/ai-prompts` prompt history
- `/tool-specific/cursor-workflow` Cursor context

## Test Plan

- [ ] `dotnet test` — all backend tests pass
- [ ] `npm test` — all frontend tests pass
- [ ] Create task from UI → appears in list
- [ ] Update task → persists after refresh
- [ ] Mark In Progress / Completed → status and counts update
- [ ] Overdue card excludes completed tasks with past due dates
- [ ] Empty state when no tasks
- [ ] Validation errors on empty required fields
- [ ] API restart → data persists

## Screenshots

*(Add dashboard, task form, empty state screenshots before submission)*

## Related Issues

Assessment submission — no external issue tracker.

## Commit History

Feature branches merged:

- `feature/backend-api`
- `feature/dashboard-ui`
- `feature/task-form`
- `feature/testing`
- `docs/final-submission`
