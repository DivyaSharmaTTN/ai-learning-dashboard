# AI Prompt History — Stretch Activity Log

---

## Entry 007 — Activity Log / Audit History

**Date**: 2026-07-09

**Branch**: `feature/stretch-activity-log`

### Prompt / Summary

Implement stretch feature: persisted activity log for task Create, Update, and StatusChanged events. Add API to retrieve history and display on task detail page. Do not break core functionality.

### Why Asked

Stretch enhancement track after core acceptance review; audit trail for task changes.

### AI Response Summary

- Added `ActivityLog` entity, EF migration, repository, and service
- Integrated logging in `TaskService` on create, update (per-field), and status patch
- Added `GET /api/tasks/{id}/activity` endpoint
- Frontend: `activityApi`, `ActivityHistory` component on `TaskDetailPage`
- 3 new backend tests; all 11 backend + 8 frontend tests passing
- Updated `feature-log`, `api-log`, `database-log`, `testing-log`, `ARCHITECTURE`, `api-contract`

### What Was Accepted

- User field = task owner name until JWT auth stretch
- Separate from dashboard `RecentActivity` (task-derived, not DB audit)
- Cascade delete activity logs when task deleted

### Files Created

- `backend/.../Entities/ActivityLog.cs`
- `backend/.../Repositories/ActivityLogRepository.cs`
- `backend/.../Services/ActivityLogService.cs`
- `backend/.../Migrations/20260709111559_AddActivityLog.cs`
- `frontend/src/api/activity.ts`
- `frontend/src/components/ActivityHistory.tsx`

### Status

Complete — pending merge to `dev`

---

*Append new stretch entries below.*
