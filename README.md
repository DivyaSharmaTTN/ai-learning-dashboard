# AI Learning Dashboard / Project Tracker

A frontend-heavy full-stack assessment project for tracking learning goals and project tasks with ownership, due dates, priority, status, and dashboard analytics.

## Project Overview

This application provides:

- **Task management** — create, list, view, update, and change status
- **Dashboard** — summary cards with real counts from the database
- **Search/filter** — keyword search and status filter
- **Persistence** — SQLite via EF Core (data survives API restart)
- **Validation** — required fields on backend and frontend
- **UI states** — loading, empty, success, and error

Built as an engineering assessment with full documentation traceability (see `/docs`, `/project-notes`, `/ai-prompts`).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Vite, React Router |
| Backend | ASP.NET Core Web API |
| Database | SQLite + Entity Framework Core |
| Backend tests | xUnit |
| Frontend tests | Vitest + React Testing Library |

## Features

- Create project tasks from UI
- Dashboard summary: Total, Completed, In Progress, Overdue, High Priority
- List and filter tasks
- Task detail and edit
- Mark In Progress / Completed
- Seeded users for task ownership
- Core automated tests

## Folder Structure

```
ai-learning-dashboard/
├── backend/                 # ASP.NET Core API
├── frontend/                # React SPA
├── docs/                    # Assessment documentation
├── project-notes/           # Living project logs
├── ai-prompts/              # AI prompt history
├── tool-specific/           # Cursor workflow files
└── README.md
```

## Prerequisites

- [.NET SDK 8+](https://dotnet.microsoft.com/download) (tested with .NET 10)
- [Node.js 18+](https://nodejs.org/)
- Git

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ai-learning-dashboard
```

### 2. Backend

```bash
cd backend/AiLearningDashboard.Api
dotnet restore
dotnet ef database update   # apply migrations
dotnet run
```

API runs at `http://localhost:5000` (see `launchSettings.json`).

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`.

### Environment

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:5000
```

## Database Setup

- SQLite file created automatically on first run/migration
- Users seeded on application startup
- Reset dev DB: delete `learningdashboard.db` and run `dotnet ef database update`

## Test Commands

```bash
# Backend
cd backend
dotnet test

# Frontend
cd frontend
npm test
```

## AI Usage Summary

This project was built with **Cursor** as an AI pair programmer:

- Requirements analysis and implementation planning
- Backend and frontend scaffolding
- Documentation maintained in sync with code
- Prompt history in `/ai-prompts`
- Workflow context in `/tool-specific/cursor-workflow`

See `ai-prompts/01-project-planning.md` for the initial session trace.

## Documentation

| Path | Purpose |
|------|---------|
| `docs/requirements-analysis.md` | Requirements breakdown |
| `docs/implementation-plan.md` | Phased build plan |
| `docs/api-contract.md` | REST API contract |
| `project-notes/project-memory.md` | Current project state |
| `tool-specific/cursor-workflow/` | Cursor context and tasks |

## Known Limitations

- No authentication (single-user assessment scope)
- No pagination on task list
- SQLite only (not SQL Server)

## Future Improvements

- User authentication
- React Query for server state
- CI/CD pipeline
- Swagger/OpenAPI UI
- Pagination and sorting

## License

Assessment submission — personal use.
