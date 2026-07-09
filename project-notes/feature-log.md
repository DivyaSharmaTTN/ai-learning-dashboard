# Feature Log

> Append-only. Newest entries at the bottom.

---

## FL-001 — Documentation Scaffold

| Field | Value |
|-------|-------|
| **Feature name** | Assessment documentation structure |
| **Requirement** | Sections 9–12 of assessment brief |
| **Files created** | `docs/*`, `project-notes/*`, `ai-prompts/*`, `tool-specific/cursor-workflow/*` |
| **Files modified** | — |
| **Database changes** | None |
| **API changes** | None |
| **Frontend changes** | None |
| **Testing added** | None |
| **Status** | Complete |
| **Date** | 2026-07-03 |

---

## FL-002 — Backend API

| Field | Value |
|-------|-------|
| **Feature name** | ASP.NET Core REST API with EF Core |
| **Requirement** | FR-01–FR-14, backend section |
| **Files created** | `backend/AiLearningDashboard.Api/**`, `backend/AiLearningDashboard.Api.Tests/**`, migration `InitialCreate` |
| **Files modified** | — |
| **Database changes** | Users + ProjectTasks tables; 3 seeded users |
| **API changes** | 7 REST endpoints |
| **Frontend changes** | None |
| **Testing added** | 6 xUnit integration tests |
| **Status** | Complete |
| **Date** | 2026-07-03 |

---

## FL-003 — Frontend Dashboard & Task Management

| Field | Value |
|-------|-------|
| **Feature name** | React dashboard, task CRUD UI |
| **Requirement** | FR-01–FR-11, FR-15–FR-19, frontend section |
| **Files created** | `frontend/src/**` (api, components, pages, context) |
| **Database changes** | None |
| **API changes** | None (consumes existing API) |
| **Frontend changes** | Dashboard, summary cards, task list, form, detail, filters, UI states |
| **Testing added** | 6 Vitest/RTL tests |
| **Status** | Complete |
| **Date** | 2026-07-03 |

---

## FL-004 — Git Workflow Setup

| Field | Value |
|-------|-------|
| **Feature name** | Git branch workflow (`dev` + feature branches) |
| **Requirement** | User Git workflow rules; no direct `main` commits |
| **Files created** | `ARCHITECTURE.md`, `CHANGELOG.md`, `TASKS.md` |
| **Files modified** | `README.md`, `tool-specific/cursor-workflow/*`, `project-notes/project-memory.md`, `project-notes/decision-log.md` |
| **Database changes** | None |
| **API changes** | None |
| **Frontend changes** | None |
| **Testing added** | None |
| **Status** | Complete |
| **Date** | 2026-07-03 |

---

## FL-005 — Modern AI SaaS Dashboard UI

| Field | Value |
|-------|-------|
| **Feature name** | Modern AI SaaS dashboard UI overhaul |
| **Requirement** | Premium UI without changing API/functionality |
| **Branch** | `feature/modern-ai-dashboard-ui` |
| **Files created** | `frontend/src/context/ThemeContext.tsx`, `frontend/src/utils/dashboardAnalytics.ts`, `frontend/src/components/ui/*`, `frontend/src/components/dashboard/*` |
| **Files modified** | Layout, SummaryCards, SearchFilter, TaskListItem, DashboardPage, index.css, App.tsx, ToastContext, EmptyState, ErrorState, tests, setupTests |
| **Database changes** | None |
| **API changes** | None |
| **Frontend changes** | Recharts charts, dark mode, insights panels, skeletons, sidebar layout |
| **Testing added** | Tests updated for ThemeProvider; 6/6 passing |
| **Status** | Complete |
| **Date** | 2026-07-03 |

---

## FL-006 — Debounced Task Search

| Field | Value |
|-------|-------|
| **Feature name** | Fix duplicate search and debounced list-only updates |
| **Requirement** | Remove topbar search; debounce/Enter search; no full-page refresh on keystroke |
| **Branch** | `feature/fix-search-debounce` |
| **Files created** | — |
| **Files deleted** | `frontend/src/context/SearchFilterContext.tsx` |
| **Files modified** | Layout, SearchFilter, DashboardPage, App.tsx, index.css, DashboardPage.test.tsx |
| **Database changes** | None |
| **API changes** | None (same `GET /api/tasks?search=&status=` contract) |
| **Frontend changes** | Local search state, 400ms debounce, list-only refetch, topbar title |
| **Testing added** | Debounce + Search button tests; 8/8 Vitest passing |
| **Status** | Complete |
| **Date** | 2026-07-06 |

---

## FL-007 — Activity Log / Audit History (Stretch)

| Field | Value |
|-------|-------|
| **Feature name** | Persisted activity log and task detail audit history |
| **Requirement** | Stretch: record Create, Update, StatusChanged; API retrieval; UI on task detail |
| **Branch** | `feature/stretch-activity-log` |
| **Files created** | `Entities/ActivityLog.cs`, `Repositories/ActivityLogRepository.cs`, `Services/ActivityLogService.cs`, `Migrations/20260709111559_AddActivityLog.cs`, `frontend/src/api/activity.ts`, `frontend/src/components/ActivityHistory.tsx` |
| **Files modified** | `TaskService.cs`, `TasksController.cs`, `TaskDtos.cs`, `AppDbContext.cs`, `Program.cs`, `TaskDetailPage.tsx`, `types/index.ts`, `index.css`, `TasksApiTests.cs`, project notes |
| **Database changes** | `ActivityLogs` table (FK → ProjectTasks, cascade delete); index on `TaskId` |
| **API changes** | `GET /api/tasks/{id}/activity` — returns `ActivityLogDto[]`; logging on POST/PUT/PATCH task |
| **Frontend changes** | `ActivityHistory` panel on task detail; `activityApi.getByTaskId()` |
| **Testing added** | 3 xUnit tests (create log, status change log, 404); backend 11/11, frontend 8/8 |
| **Status** | Complete |
| **Date** | 2026-07-09 |

---

## FL-008 — Canonical Git Workflow Cursor Rule

| Field | Value |
|-------|-------|
| **Feature name** | Adopt `.cursor/rules/git-workflow.mdc` as always-applied project rule |
| **Requirement** | User mandate: follow git-workflow rule; append doc history on every change |
| **Branch** | `docs/git-workflow-rules` (suggested) or current working branch |
| **Files created** | `.cursor/rules/git-workflow.mdc`, `ai-prompts/08-git-workflow-rules.md` |
| **Files modified** | `ai-prompts/.cursor/rules/git-workflow.mdc` (pointer), `tool-specific/cursor-workflow/*`, `project-notes/decision-log.md`, `project-notes/project-memory.md`, `CHANGELOG.md`, `README.md` |
| **Database changes** | None |
| **API changes** | None |
| **Frontend changes** | None |
| **Testing added** | None |
| **Status** | Complete |
| **Date** | 2026-07-09 |

---

## FL-009 — Extended Filters and Pagination (Stretch)

| Field | Value |
|-------|-------|
| **Feature name** | Priority/category filters and paginated task list |
| **Requirement** | Stretch: filter by priority and category; paginate task list (10 per page) |
| **Branch** | `feature/stretch-filters-pagination` |
| **Files created** | `backend/.../Repositories/TaskListQuery.cs`, `frontend/src/components/TaskPagination.tsx`, `ai-prompts/09-stretch-filters-pagination.md` |
| **Files modified** | `TaskRepository.cs`, `TaskService.cs`, `TasksController.cs`, `TaskDtos.cs`, `SearchFilter.tsx`, `DashboardPage.tsx`, `tasks.ts`, `types/index.ts`, `index.css`, `TasksApiTests.cs`, `DashboardPage.test.tsx`, docs and project notes |
| **Database changes** | None (query-only) |
| **API changes** | `GET /api/tasks` accepts `priority`, `category`, `page`, `pageSize`; returns `PagedResultDto` when `page` is set |
| **Frontend changes** | Priority/category dropdowns, clear-filters button, `TaskPagination` controls, list uses `tasksApi.getPaged()` |
| **Testing added** | 3 xUnit (priority, category, pagination); 1 Vitest (priority resets page); backend 14/14, frontend 9/9 |
| **Cursor prompt summary** | Create branch from dev and implement stretch filters + pagination |
| **What AI suggested** | Optional pagination on API (flat array without `page`, paged envelope with `page`); dashboard panels keep unpaginated fetch |
| **What was accepted** | Dual response shape, default page size 10, filter reset to page 1 |
| **Status** | Complete |
| **Date** | 2026-07-09 |

---

*Append new features below.*
