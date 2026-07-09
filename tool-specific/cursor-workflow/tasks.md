# Tasks (Cursor Workflow)

## Legend

- [ ] Pending
- [x] Done
- [~] In progress

---

## Phase 1: Foundation

- [x] Analyze repository (empty git repo)
- [x] Create `docs/` structure
- [x] Create `project-notes/` structure
- [x] Create `ai-prompts/` structure
- [x] Create `tool-specific/cursor-workflow/`
- [x] README.md

## Phase 2: Backend

- [x] Scaffold `AiLearningDashboard.Api` solution
- [x] Entities + DbContext + migrations
- [x] Seed users
- [x] Task repository/service
- [x] Dashboard service (count queries)
- [x] Controllers + DTOs
- [x] FluentValidation
- [x] CORS configuration
- [x] xUnit test project

## Phase 3: Frontend

- [x] Vite React TypeScript scaffold
- [x] API client module
- [x] React Router setup
- [x] DashboardPage + SummaryCards
- [x] TaskList + SearchFilter
- [x] TaskForm (create/edit)
- [x] TaskDetailPage
- [x] UI state components
- [x] Toast/success messages

## Phase 4: Testing

- [x] Backend integration tests
- [x] Frontend component tests
- [ ] Manual E2E verification

## Phase 5: Finalization

- [x] Sync project notes and api-log
- [x] Git workflow: `dev` branch + feature branch policy documented
- [ ] Merge feature branches to `dev`, then PR to `main`
- [ ] PR description with screenshots

---

## Git Workflow Task (2026-07-03)

- [x] Record initial commit on `main` (`413947a`)
- [x] Create `dev` branch
- [x] Create `feature/git-workflow-setup`
Git workflow established. UI overhaul on `feature/modern-ai-dashboard-ui`.

## UI Overhaul Task (2026-07-03)

- [x] Install recharts + lucide-react
- [x] ThemeContext light/dark mode
- [x] Premium summary cards, task cards, sidebar layout
- [x] Charts, AI Insights, Recent Activity, Upcoming Deadlines
- [x] Skeleton loading, enhanced toasts/transitions
- [x] Tests updated (8/8 passing)

## Stretch: Filters & Pagination (2026-07-09)

- [x] `GET /api/tasks` priority and category query params
- [x] Paginated response when `page` is provided (`PagedResultDto`)
- [x] `TaskPagination` component and extended `SearchFilter`
- [x] `DashboardPage` uses `getPaged()` for list, `getAll()` for panels
- [x] 3 backend + 1 frontend tests; 14/14 xUnit, 9/9 Vitest

## Stretch: Activity Log (2026-07-09)

- [x] `ActivityLog` entity + migration `AddActivityLog`
- [x] `ActivityLogRepository` + `ActivityLogService`
- [x] Log Created / Updated / StatusChanged in `TaskService`
- [x] `GET /api/tasks/{id}/activity`
- [x] `ActivityHistory` component on `TaskDetailPage`
- [x] 3 activity log integration tests (11 backend total)
- [x] Project notes and API contract updated

## Git Workflow Rules (2026-07-09)

- [x] Canonical rule: `.cursor/rules/git-workflow.mdc` (`alwaysApply: true`)
- [x] `ai-prompts/08-git-workflow-rules.md` prompt history
- [x] Sync `cursor-rules-or-instructions.md`, `project-context.md`, `spec.md`
- [x] Append-only history policy documented across workflow files

---

## Session 1 Notes

Started 2026-07-03. Full stack implemented in Session 1. Backend on :5000, frontend on :5173. All automated tests green.
