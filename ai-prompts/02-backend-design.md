# AI Prompt History — Backend Design

---

## Entry 001 — Backend Architecture (Planned)

**Date**: 2026-07-03

### Prompt / Summary

Implicit from assessment spec: ASP.NET Core Web API with Controllers, DTOs, Entities, DbContext, Services, Repositories, Validation.

### Why Asked

Meet backend requirements for REST API, persistence, and validation.

### AI Response Summary

Planned structure:
- `backend/AiLearningDashboard.Api/` — main API
- `backend/AiLearningDashboard.Api.Tests/` — xUnit integration tests
- Layers: Controllers → Services → Repositories → `AppDbContext`
- FluentValidation on create/update DTOs
- `DashboardService` computes counts from EF queries (no hardcoding)
- SQLite file database with seeded users

### What Was Accepted

- Pending implementation in Session 1 continuation

### AI Response Summary (Session 1 implementation)

- Implemented full backend: entities, DbContext, repositories, services, controllers
- FluentValidation on Create/Update/Status DTOs
- `DashboardRepository` computes all 5 counts via EF LINQ (no hardcoding)
- Migration `InitialCreate` with seeded users
- 6 xUnit integration tests — all passing

### What Was Accepted

- Layered architecture as planned
- TaskStatus alias to resolve ambiguity with `System.Threading.Tasks.TaskStatus`

### Files Affected

- `backend/AiLearningDashboard.Api/**`
- `backend/AiLearningDashboard.Api.Tests/TasksApiTests.cs`
- `project-notes/api-log.md`, `database-log.md`

### Git Commit Reference

`[COMMIT_HASH_PLACEHOLDER]` — `feat(backend): add task CRUD, dashboard summary, and integration tests`

---

*Append entries as backend is built.*
