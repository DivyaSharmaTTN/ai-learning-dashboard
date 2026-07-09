# Project Memory

> **Last updated**: 2026-07-09 — Git workflow rule at `.cursor/rules/git-workflow.mdc`

## Git Workflow

| Branch | Commit / Role |
|--------|---------------|
| `main` | `413947a` — Initial project setup (baseline; do not recreate) |
| `dev` | Integration branch for all merged features |
| `feature/*` | Active development — e.g. `feature/stretch-activity-log`, `feature/core-acceptance-review` |

**Policy**: Never commit directly to `main`. Do not commit feature work to `dev` unless asked. Branch from `dev`.  
**Cursor rule**: `.cursor/rules/git-workflow.mdc` — append doc history on every change; never overwrite prior entries.

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
| Cursor rules | `.cursor/rules/git-workflow.mdc` (always apply) |

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

### ActivityLogs (stretch)

| Column | Type | Notes |
|--------|------|-------|
| Id | int PK | |
| TaskId | int FK | → ProjectTasks |
| Action | string | Created, Updated, StatusChanged |
| PreviousValue | string? | optional |
| NewValue | string? | optional |
| User | string | actor (owner name until auth) |
| Timestamp | DateTime | UTC |

## API Endpoints

| Method | Route | Status |
|--------|-------|--------|
| GET | `/api/users` | ✅ Implemented |
| GET | `/api/tasks` | ✅ Implemented |
| GET | `/api/tasks/{id}` | ✅ Implemented |
| GET | `/api/tasks/{id}/activity` | ✅ Implemented (stretch: activity log) |
| POST | `/api/tasks` | ✅ Implemented |
| PUT | `/api/tasks/{id}` | ✅ Implemented |
| PATCH | `/api/tasks/{id}/status` | ✅ Implemented |
| GET | `/api/dashboard/summary` | ✅ Implemented |

## Current Implementation Status

| Area | Status |
|------|--------|
| Documentation scaffold | ✅ Complete |
| Backend API | ✅ Complete |
| Frontend UI | ✅ Complete (modern AI SaaS overhaul) |
| Backend tests | ✅ 14 passing |
| Frontend tests | ✅ 9 passing |
| Stretch: activity log | ✅ Complete |
| Stretch: filters + pagination | ✅ Complete |
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
- React + Vite frontend with modern AI SaaS UI (charts, dark mode, insights)
- Loading, empty, success (toast), error UI states
- xUnit integration tests (14) and Vitest component tests (9)
- Activity log: `ActivityLogs` table, audit API, task detail history panel (stretch)
- Extended filters (priority, category) and paginated task list (stretch)
- Git workflow rule canonicalized at `.cursor/rules/git-workflow.mdc` with append-only doc policy

## Pending Work

1. Manual end-to-end verification with both servers running
2. Merge stretch and core feature branches → `dev`
3. Remaining stretch features (auth, sorting, etc.)
4. Commit workflow rule + stretch branches when ready

## Important Decisions

| Decision | Rationale |
|----------|-----------|
| SQLite | Zero-install for assessors |
| Vite + React TS | Modern, fast dev experience |
| FluentValidation | Clear backend validation messages |
| String enum JSON | Readable API responses for React |
| Activity log user = owner name | JWT auth not yet implemented (stretch) |
| Canonical git-workflow rule | `.cursor/rules/git-workflow.mdc`; append-only docs on every change |
| No auth (core) | Out of assessment scope; auth planned as stretch |

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
- Sorting on task list
