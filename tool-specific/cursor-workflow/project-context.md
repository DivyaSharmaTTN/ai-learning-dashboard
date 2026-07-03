# Project Context (Cursor)

## What This Project Is

AI Learning Dashboard — a frontend-heavy assessment app for tracking learning goals and project tasks.

## Repository State

| Item | Value |
|------|-------|
| **Active branch** | `feature/modern-ai-dashboard-ui` (from `dev`) |
| **Integration branch** | `dev` |
| **Stable branch** | `main` — initial commit `413947a` (`Initial project setup`); **do not recreate history** |
| **Stack** | React + Vite, ASP.NET Core, EF Core SQLite |

## Git Workflow (Mandatory)

1. **Never work directly on `main`**
2. Branch from `dev`: `feature/<task-name>`
3. Merge feature → `dev` → PR to `main` when stable
4. Keep solution buildable; run `dotnet build` + `dotnet test` + `npm test` before completing tasks
5. Update README, CHANGELOG, ARCHITECTURE, TASKS, and project notes after every change

## Key Constraints (Always Enforce)

1. **No hardcoded dashboard counts** — must come from `/api/dashboard/summary`
2. **All UI states** — loading, empty, success, error
3. **Dual validation** — backend + frontend
4. **Update docs** on every implementation change
5. **Append** to project notes; never overwrite history
6. **No stretch features** until core complete
7. **No secrets** in repo

## Folder Map

- `backend/` — ASP.NET Core API
- `frontend/` — React SPA
- `docs/` — Assessment documentation
- `project-notes/` — Living logs (source of truth for current state: `project-memory.md`)
- `ai-prompts/` — Prompt history with commit placeholders
- `ARCHITECTURE.md`, `CHANGELOG.md`, `TASKS.md` — Root workflow docs

## API Base URL

- Dev: `http://localhost:5000`

## Current Focus

Git workflow established on `dev`. Next: manual E2E verification, merge feature branches.

## Standards

- Meaningful commit messages: `feat(scope):`, `fix(scope):`, `docs:`, `test:`
- Feature branches from `dev` only
- After each session: update `project-memory.md`, `feature-log.md`, CHANGELOG, TASKS
