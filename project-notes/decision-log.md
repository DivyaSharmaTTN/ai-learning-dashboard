# Decision Log

> Append-only engineering decisions.

---

## DL-001 — SQLite over SQL Server

| Field | Value |
|-------|-------|
| **Decision** | Use SQLite with EF Core |
| **Why chosen** | No external DB install; single file persistence; sufficient for assessment |
| **Alternative considered** | SQL Server LocalDB |
| **Trade-off** | Less production-like; simpler ops |
| **Impact** | `learningdashboard.db` file; connection string in `appsettings.json` |
| **Date** | 2026-07-03 |

---

## DL-002 — Vite + React TypeScript

| Field | Value |
|-------|-------|
| **Decision** | Scaffold frontend with Vite React TS template |
| **Why chosen** | Fast HMR, standard modern stack, Vitest integration |
| **Alternative considered** | Create React App, Next.js |
| **Trade-off** | No SSR (not needed) |
| **Impact** | `frontend/` with `vite.config.ts` |
| **Date** | 2026-07-03 |

---

## DL-003 — Dashboard counts from service layer

| Field | Value |
|-------|-------|
| **Decision** | `DashboardService` queries EF for all five counts |
| **Why chosen** | Assessment forbids hardcoded counts; single source of truth |
| **Alternative considered** | Frontend-side counting from task list |
| **Trade-off** | Extra API call; accurate for large lists |
| **Impact** | `GET /api/dashboard/summary` |
| **Date** | 2026-07-03 |

---

## DL-004 — Documentation-first workflow

| Field | Value |
|-------|-------|
| **Decision** | Create all doc scaffolding before application code |
| **Why chosen** | Assessment requires traceability; empty repo |
| **Alternative considered** | Code first, docs later |
| **Trade-off** | Slower initial velocity |
| **Impact** | All `/docs` and `/project-notes` files exist early |
| **Date** | 2026-07-03 |

---

*Append new decisions below.*
