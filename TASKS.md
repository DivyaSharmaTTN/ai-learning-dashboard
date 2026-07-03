# Tasks

> Active task tracker. Cursor workflow mirror: `tool-specific/cursor-workflow/tasks.md`

## Legend

- [ ] Pending
- [x] Done
- [~] In progress

---

## Git Workflow (Active Policy)

- [x] Initial commit on `main` recorded (`413947a`) — do not recreate history
- [x] Create `dev` branch from `main`
- [x] Document branch workflow in README, ARCHITECTURE, CHANGELOG
- [ ] Merge `feature/git-workflow-setup` → `dev`
- [ ] Ongoing: use `feature/<task-name>` from `dev` for all new work
- [ ] Never commit directly to `main`

---

## Phase 1: Foundation

- [x] Analyze repository
- [x] Create documentation structure
- [x] README.md

## Phase 2: Backend

- [x] ASP.NET Core API, EF Core SQLite, validation, dashboard summary
- [x] xUnit integration tests (6 passing)

## Phase 3: Frontend

- [x] React dashboard, task CRUD, filters, UI states
- [x] Vitest/RTL tests (6 passing)

## Phase 4: Testing & QA

- [x] Automated tests green
- [ ] Manual E2E verification

## Phase 5: Finalization

- [x] Project notes synced
- [~] Git workflow established (this task)
- [ ] PR to `main` via `dev` with screenshots

---

## Current Branch

`feature/git-workflow-setup` (from `dev`)

---

*Last updated: 2026-07-03*
