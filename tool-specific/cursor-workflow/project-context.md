# Project Context (Cursor)

> **Last updated**: 2026-07-09 — JWT auth RBAC on `feature/stretch-auth-rbac`

## What This Project Is

AI Learning Dashboard — a frontend-heavy assessment app for tracking learning goals and project tasks.

## Repository State

| Item | Value |
|------|-------|
| **Stable branch** | `main` — initial commit `413947a` (`Initial project setup`); **do not recreate history** |
| **Integration branch** | `dev` |
| **Feature branches** | `feature/stretch-auth-rbac`, `feature/stretch-filters-pagination`, others (see `TASKS.md`) |
| **Stack** | React + Vite, ASP.NET Core, EF Core SQLite |
| **Cursor rules** | `.cursor/rules/git-workflow.mdc` (`alwaysApply: true`) |

## Git Workflow (Mandatory)

See **`.cursor/rules/git-workflow.mdc`** for full rules. Summary:

1. **Never work directly on `main`** for features
2. **Do not work directly on `dev`** unless explicitly asked
3. Branch from `dev`: `feature/<task-name>`, `bugfix/`, `docs/`, `test/`
4. Merge feature → `dev` → PR to `main` when stable
5. Keep solution buildable; run `dotnet build` + `dotnet test` + `npm test` before completing tasks
6. **Append** documentation on every change; never overwrite history
7. Update README, CHANGELOG, ARCHITECTURE, TASKS, and project notes after every change

## Key Constraints (Always Enforce)

1. **No hardcoded dashboard counts** — must come from `/api/dashboard/summary`
2. **All UI states** — loading, empty, success, error
3. **Dual validation** — backend + frontend
4. **Update docs** on every implementation change (append only — see `.cursor/rules/git-workflow.mdc`)
5. **Append** to project notes; never overwrite history
6. **No stretch features** until core complete (stretch branches OK with doc traceability)
7. **No secrets** in repo

## Folder Map

- `backend/` — ASP.NET Core API
- `frontend/` — React SPA
- `docs/` — Assessment documentation
- `project-notes/` — Living logs (source of truth for current state: `project-memory.md`)
- `ai-prompts/` — Prompt history with commit placeholders
- `.cursor/rules/` — Always-applied Cursor rules (`git-workflow.mdc`)
- `ARCHITECTURE.md`, `CHANGELOG.md`, `TASKS.md` — Root workflow docs

## API Base URL

- Dev: `http://localhost:5000`

## Current Focus

- Stretch: in-app notifications complete on `feature/task-notifications`
- Merge stretch feature branches → `dev` when requested; do not merge notifications yet
- Manual E2E: assign as Admin, start/complete as User, verify bell messages
- All agents must follow `.cursor/rules/git-workflow.mdc` on every task

## Standards

- Meaningful commit messages: `feat(scope):`, `fix(scope):`, `docs:`, `test:`
- Feature branches from `dev` only
- After each session: update `project-memory.md`, `feature-log.md`, CHANGELOG, TASKS
