# Project Context (Cursor)

## What This Project Is

AI Learning Dashboard — a frontend-heavy assessment app for tracking learning goals and project tasks.

## Repository State

| Item | Value |
|------|-------|
| Branch | `main` (initial) |
| Commits | None at project start |
| Stack | React + Vite, ASP.NET Core, EF Core SQLite |

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

## API Base URL

- Dev: `http://localhost:5000`

## Current Focus

Session 1: Documentation scaffold → Backend API → Frontend UI → Tests

## Standards

- Meaningful commit messages: `feat(scope):`, `fix(scope):`, `docs:`, `test:`
- Feature branches per `docs/implementation-plan.md`
- After each session: update `project-memory.md`, `feature-log.md`, relevant logs
