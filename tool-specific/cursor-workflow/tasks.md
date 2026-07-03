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
- [x] Add ARCHITECTURE.md, CHANGELOG.md, TASKS.md
- [x] Update README and Cursor workflow docs

---

## Session 1 Notes

Started 2026-07-03. Full stack implemented in Session 1. Backend on :5000, frontend on :5173. All automated tests green.
