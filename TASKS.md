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
- [x] `feature/git-workflow-setup` — Git workflow docs
- [x] `feature/modern-ai-dashboard-ui` — Modern AI SaaS UI
- [x] `feature/fix-search-debounce` — Debounced task search, remove duplicate topbar search
- [x] `feature/core-acceptance-review` — Core acceptance gap fixes (error retry, stronger tests)
- [x] `feature/stretch-activity-log` — Activity log entity, API, task detail UI
- [x] `feature/stretch-filters-pagination` — Priority/category filters and paginated task list
- [x] Adopt `.cursor/rules/git-workflow.mdc` — append-only doc history on every change
- [ ] Merge feature branches → `dev`
- [ ] Never commit directly to `main`

---

## Phase 3: Frontend

- [x] React dashboard, task CRUD, filters, UI states
- [x] Vitest/RTL tests (8 passing)
- [x] Modern AI SaaS UI overhaul (Recharts, dark mode, insights)
- [x] Debounced task search; list-only AJAX updates; no duplicate topbar search
- [x] Activity history on task detail (stretch)

## Phase 4: Testing & QA

- [x] Automated tests green (backend 11, frontend 8)
- [ ] Manual E2E verification

## Phase 5: Finalization

- [x] Project notes synced
- [~] Git workflow established (this task)
- [ ] PR to `main` via `dev` with screenshots

---

## Current Branch

Use `feature/<task-name>` from `dev` per `.cursor/rules/git-workflow.mdc`.  
Recent: `feature/stretch-filters-pagination`, `feature/stretch-activity-log`.

---

*Last updated: 2026-07-09*
