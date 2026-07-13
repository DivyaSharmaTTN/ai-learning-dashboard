# AI Prompt History — Stretch Task Notifications

---

## Entry 010 — In-App Task Notifications

**Date**: 2026-07-13

**Branch**: `feature/task-notifications`

### Prompt / Summary

Create branch `feature/task-notifications` and implement in-app notifications:

- Admin assigns task → User sees “A new task has been assigned to you.”
- User starts/completes task → Admin sees “\<User\> started/completed \<Title\>.”
- Notification entity: id, recipientUserId, taskId, message, type, isRead, createdAt
- APIs: list current user, mark one read, mark all read
- Bell dropdown; click opens related task; persist in DB
- Backend + frontend tests; update all docs; do not merge to dev/main

### Why Asked

Stretch enhancement for assignment and status awareness between Admin and User roles.

### AI Response Summary

- Added `Notification` entity, EF migration `AddNotifications`, repository, service, controller
- Hooked `TaskService` create/reassign/status to emit notifications
- Frontend `NotificationBell` with unread badge, dropdown, mark-read, navigate to `/tasks/:id`
- 7 backend + 4 frontend tests (backend suite 29/29)
- Appended docs, project-notes, cursor-workflow, and this prompt file

### What Was Accepted

- Separate from ActivityLog
- Notify all users with Role=Admin on start/complete
- Poll unread count every 30s (no SignalR)
- Unread badge only when count > 0

### What Was Rejected / Deferred

- SignalR / realtime push
- Public create-notification API

### Suggested Commit Message

`feat(notifications): add in-app task assignment and status alerts`

### Status

Complete — pending review; do not merge to `dev` or `main`

---

*Append new stretch entries below.*
