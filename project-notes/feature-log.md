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

*Append new features below.*
