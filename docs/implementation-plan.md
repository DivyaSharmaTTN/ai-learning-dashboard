# Implementation Plan

## Current Repository State

- **Status**: Initial commit on `main` (`413947a` — `Initial project setup`); do not recreate history
- **Integration branch**: `dev` (created from `main`)
- **Active work**: `feature/git-workflow-setup` from `dev`
- **Existing code**: Full stack implemented (see Session 1)

## Architecture

```
┌─────────────────┐     HTTP/JSON      ┌──────────────────────┐
│  React (Vite)   │ ◄────────────────► │ ASP.NET Core Web API │
│  Port 5173      │                    │ Port 5000/5001       │
└─────────────────┘                    └──────────┬───────────┘
                                                │
                                                ▼
                                     ┌──────────────────────┐
                                     │ EF Core + SQLite     │
                                     │ learningdashboard.db │
                                     └──────────────────────┘
```

## Folder Structure (Target)

```
ai-learning-dashboard/
├── backend/
│   ├── AiLearningDashboard.Api/
│   └── AiLearningDashboard.Api.Tests/
├── frontend/
├── docs/
├── project-notes/
├── ai-prompts/
├── tool-specific/cursor-workflow/
└── README.md
```

## Implementation Phases

### Phase 1: Foundation & Documentation (Session 1)

- [x] Analyze empty repository
- [x] Create `docs/`, `project-notes/`, `ai-prompts/`, `tool-specific/cursor-workflow/`
- [ ] Initial README scaffold

**Branch**: `docs/initial-setup`  
**Commit**: `docs: add requirements analysis and project documentation scaffold`

### Phase 2: Backend API

1. Create solution: `dotnet new webapi`
2. Add EF Core SQLite, entities (`User`, `ProjectTask`)
3. DbContext, migrations, seed users
4. Repository + service layer
5. DTOs + FluentValidation or DataAnnotations
6. Controllers: Tasks, Dashboard, Users
7. CORS for React dev server
8. xUnit test project (WebApplicationFactory)

**Branch**: `feature/backend-api`  
**Commits**:
- `feat(backend): scaffold API solution with EF Core SQLite`
- `feat(backend): add task and user endpoints with validation`
- `feat(backend): add dashboard summary endpoint`
- `test(backend): add integration tests for tasks and dashboard`

### Phase 3: Frontend UI

1. `npm create vite@latest frontend -- --template react-ts`
2. API client module (`fetch` wrapper)
3. Pages: Dashboard (list + summary), TaskDetail, Create/Edit
4. Components: SummaryCards, TaskList, TaskForm, SearchFilter, Loading, Empty, Error, Toast
5. React Router for navigation
6. Form validation (required fields)

**Branch**: `feature/dashboard-ui`, `feature/task-form`  
**Commits**:
- `feat(frontend): scaffold React app with routing and API client`
- `feat(frontend): add dashboard summary cards and task list`
- `feat(frontend): add task create/edit form and detail view`
- `feat(frontend): add search filter and UI states`

### Phase 4: Testing

1. Backend: validation, CRUD, dashboard counts, overdue logic
2. Frontend: Vitest + RTL — create, list, update, dashboard

**Branch**: `feature/testing`  
**Commit**: `test: add frontend component tests for core flows`

### Phase 5: Integration & Polish

1. End-to-end manual verification
2. Update all project notes and docs to match code
3. Bug fixes (e.g. dashboard counts)

**Branch**: `bugfix/dashboard-counts` (if needed), `docs/final-submission`

## Entity Design

### Enums

- `TaskPriority`: Low = 0, Medium = 1, High = 2
- `TaskStatus`: NotStarted = 0, InProgress = 1, Completed = 2
- `TaskCategory`: Learning, Project, Certification, Other

### Relationships

- `ProjectTask.OwnerId` → `User.Id` (required FK)

## API Design Summary

See `docs/api-contract.md` for full contract (updated as implemented).

## Frontend Routes

| Route | Page |
|-------|------|
| `/` | Dashboard (summary + task list) |
| `/tasks/new` | Create task |
| `/tasks/:id` | Task detail / edit |

## Testing Strategy

See `docs/test-strategy.md`.

## Session 1 Deliverables

1. Full documentation scaffold
2. Backend solution (in progress after docs)
3. This implementation plan kept current in `project-notes/project-memory.md`

## Remaining Work After Session 1

- Complete backend implementation
- Complete frontend implementation
- All automated tests green
- Final documentation sync
- Git history with feature branches

## Estimated Commits (Full Project)

| # | Message | Branch |
|---|---------|--------|
| 1 | docs: initial project documentation and planning | docs/initial-setup |
| 2 | feat(backend): scaffold API with EF Core | feature/backend-api |
| 3 | feat(backend): task CRUD and validation | feature/backend-api |
| 4 | feat(backend): dashboard summary API | feature/backend-api |
| 5 | test(backend): integration tests | feature/testing |
| 6 | feat(frontend): React app scaffold | feature/dashboard-ui |
| 7 | feat(frontend): dashboard and task list | feature/dashboard-ui |
| 8 | feat(frontend): task form and detail | feature/task-form |
| 9 | test(frontend): core flow tests | feature/testing |
| 10 | docs: final submission updates | docs/final-submission |
