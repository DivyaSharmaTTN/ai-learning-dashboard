# Project Memory

> **Last updated**: 2026-07-03 — Git workflow established on `dev`

## Git Workflow

| Branch | Commit / Role |
|--------|---------------|
| `main` | `413947a` — Initial project setup (baseline; do not recreate) |
| `dev` | Integration branch for all merged features |
| `feature/*` | Active development (current: `feature/git-workflow-setup`) |

**Policy**: Never commit directly to `main`. All new work branches from `dev`.

## Current Architecture

```
React (Vite) SPA  ──HTTP/JSON──►  ASP.NET Core Web API  ──EF Core──►  SQLite
```

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18+, TypeScript, Vite, React Router, Vitest, RTL |
| Backend | ASP.NET Core Web API (.NET 10) |
| ORM | Entity Framework Core |
| Database | SQLite |
| Backend tests | xUnit, WebApplicationFactory |
| Frontend tests | Vitest, React Testing Library |
| AI tooling | Cursor |

## Folder Structure

```
ai-learning-dashboard/
├── backend/
│   ├── AiLearningDashboard.Api/
│   └── AiLearningDashboard.Api.Tests/
├── frontend/
├── docs/
├── project-notes/          ← this folder
├── ai-prompts/
├── tool-specific/cursor-workflow/
└── README.md
```

## Database Schema (Planned)

### Users

| Column | Type | Notes |
|--------|------|-------|
| Id | int PK | |
| Name | string | required |
| Email | string | required |
| Role | string | required |

### ProjectTasks

| Column | Type | Notes |
|--------|------|-------|
| Id | int PK | |
| Title | string | required, max 200 |
| Description | string | optional |
| Category | enum/string | required |
| Priority | enum | Low/Medium/High |
| Status | enum | NotStarted/InProgress/Completed |
| OwnerId | int FK | → Users |
| DueDate | DateTime | required |
| CreatedAt | DateTime | UTC |
| UpdatedAt | DateTime | UTC |

## API Endpoints

| Method | Route | Status |
|--------|-------|--------|
| GET | `/api/users` | ✅ Implemented |
| GET | `/api/tasks` | ✅ Implemented |
| GET | `/api/tasks/{id}` | ✅ Implemented |
| POST | `/api/tasks` | ✅ Implemented |
| PUT | `/api/tasks/{id}` | ✅ Implemented |
| PATCH | `/api/tasks/{id}/status` | ✅ Implemented |
| GET | `/api/dashboard/summary` | ✅ Implemented |

## Current Implementation Status

| Area | Status |
|------|--------|
| Documentation scaffold | ✅ Complete |
| Backend API | ✅ Complete |
| Frontend UI | ✅ Complete |
| Backend tests | ✅ 6 passing |
| Frontend tests | ✅ 6 passing |
| README | ✅ Complete |
| Manual E2E verification | ⏳ Recommended |

## Completed Work

- Repository analysis (empty git repo)
- Full `docs/` assessment documentation
- `project-notes/`, `ai-prompts/`, `tool-specific/cursor-workflow/` structure
- Implementation plan and design notes
- ASP.NET Core API with EF Core SQLite, migrations, seed users
- REST endpoints: tasks CRUD, status patch, dashboard summary, users
- FluentValidation on create/update DTOs
- React + Vite frontend with dashboard, task form, detail, filters
- Loading, empty, success (toast), error UI states
- xUnit integration tests (6) and Vitest component tests (6)

## Pending Work

1. Manual end-to-end verification with both servers running
2. Git commits on feature branches (user action)
3. Fill `[COMMIT_HASH_PLACEHOLDER]` in prompt history after commits

## Important Decisions

| Decision | Rationale |
|----------|-----------|
| SQLite | Zero-install for assessors |
| Vite + React TS | Modern, fast dev experience |
| FluentValidation | Clear backend validation messages |
| String enum JSON | Readable API responses for React |
| No auth | Out of assessment scope |

## Design Trade-offs

- Local component state vs React Query — chose simplicity for assessment
- CSS variables vs UI library — lighter dependency footprint

## Known Issues

- None yet (greenfield)

## Future Improvements

- Authentication
- React Query for caching
- Swagger UI in production README
- GitHub Actions CI
- Pagination on task list
