# API Log

> Living endpoint documentation.

---

*Last updated: 2026-07-09 — feature/stretch-auth-rbac*

---

## POST `/api/auth/login`

- **Purpose**: Authenticate user and return JWT
- **Auth**: Anonymous
- **Body**: `{ email, password }`
- **Response 200**: `{ token, expiresAt, user: { id, name, email, role } }`
- **Response 401**: Invalid credentials
- **Used by**: `LoginPage`, `AuthContext`

---

## Authorization (all endpoints below require `Authorization: Bearer <token>`)

**Task creation policy:** Only **Admin** may create or fully edit tasks. **User** may list/view assigned tasks and PATCH status on own tasks only. This is enforced in API (`[Authorize(Roles = Admin)]` on POST/PUT) and UI (no create nav/CTA for User).

| Endpoint | Admin | User |
|----------|-------|------|
| `GET /api/users` | Yes | Forbidden |
| `GET /api/dashboard/summary` | Yes | Forbidden |
| `GET /api/tasks` | All tasks | Own tasks only (`ownerId` filter) |
| `GET /api/tasks/{id}` | Yes | Own task only |
| `GET /api/tasks/{id}/activity` | Yes | Own task only |
| `POST /api/tasks` | Yes | Forbidden |
| `PUT /api/tasks/{id}` | Yes | Forbidden |
| `PATCH /api/tasks/{id}/status` | Yes | Own task only |

---

## GET `/api/users`

- **Purpose**: Return users for owner dropdown (Admin only)
- **Auth**: `Admin` role required
- **Request**: None
- **Response 200**: `[{ id, name, email, role }]`
- **Response 403**: Non-admin
- **Used by**: `CreateTaskPage`, `TaskDetailPage` (Admin only)

---

## GET `/api/tasks`

- **Purpose**: List tasks with optional search, status, priority, and category filters; optional pagination
- **Auth**: Authenticated; User sees only assigned tasks
- **Query**: `search`, `status`, `priority`, `category`, `page`, `pageSize`
- **Response 200 (no page)**: Array of `TaskDto` with `isOverdue` computed
- **Response 200 (with page)**: `{ items, totalCount, page, pageSize, totalPages }`
- **Used by**: `DashboardPage` (panels use flat list; task list uses paginated response), `TaskList`

---

## GET `/api/tasks/{id}`

- **Purpose**: Single task detail
- **Auth**: Authenticated; User must own task
- **Response 200**: `TaskDto` | **404**: not found | **403**: not owner (User)

---

## GET `/api/tasks/{id}/activity`

- **Purpose**: Audit history for a task (stretch: activity log)
- **Auth**: Authenticated; User must own task
- **Response 200**: `[{ id, taskId, action, previousValue, newValue, user, timestamp }]`
- **Response 404**: Task not found
- **Actions logged**: `Created`, `Updated`, `StatusChanged` (on POST/PUT/PATCH task)
- **User field**: Authenticated user name on status change; owner name on create/update
- **Used by**: `TaskDetailPage`, `ActivityHistory`

---

## POST `/api/tasks`

- **Purpose**: Create task
- **Auth**: `Admin` role required
- **Body**: `CreateTaskDto` (title, description?, category, priority, status, ownerId, dueDate)
- **Validation**: FluentValidation — required fields, enum values, ownerId > 0; service validates owner exists
- **Response 201**: Created `TaskDto`
- **Used by**: `CreateTaskPage`, `TaskForm`

---

## PUT `/api/tasks/{id}`

- **Purpose**: Full task update
- **Auth**: `Admin` role required
- **Body**: `UpdateTaskDto`
- **Validation**: Same as POST
- **Response 200**: Updated `TaskDto` | **404** | **400**
- **Used by**: `TaskDetailPage`, `TaskForm`

---

## PATCH `/api/tasks/{id}/status`

- **Purpose**: Quick status change (In Progress / Completed)
- **Auth**: Admin any task; User own tasks only
- **Body**: `{ "status": "InProgress" }`
- **Validation**: Valid enum required
- **Response 200**: Updated `TaskDto`
- **Used by**: `TaskListItem` Start/Complete buttons

---

## GET `/api/dashboard/summary`

- **Purpose**: Dashboard counts from DB queries (not hardcoded)
- **Auth**: `Admin` role required
- **Response 200**: `{ totalItems, completedItems, inProgressItems, overdueItems, highPriorityItems }`
- **Overdue rule**: `dueDate.Date < UtcNow.Date && status != Completed`
- **Used by**: `SummaryCards`, `DashboardPage` (Admin only)

---

## Notifications (2026-07-13 — feature/task-notifications)

### GET `/api/notifications`

- **Purpose**: List current user's notifications (newest first)
- **Auth**: Any authenticated user
- **Query**: `unreadOnly` (optional bool)
- **Response 200**: `NotificationDto[]`
- **Used by**: `NotificationBell`

### GET `/api/notifications/unread-count`

- **Purpose**: Badge count for bell icon
- **Auth**: Any authenticated user
- **Response 200**: `{ count }`
- **Used by**: `NotificationBell`

### PATCH `/api/notifications/{id}/read`

- **Purpose**: Mark one notification as read
- **Auth**: Recipient only (403 otherwise)
- **Response 204** | **404** | **403**
- **Used by**: `NotificationBell` on item click

### POST `/api/notifications/read-all`

- **Purpose**: Mark all current-user notifications as read
- **Auth**: Any authenticated user
- **Response 204**
- **Used by**: `NotificationBell` “Mark all read”

### Creation (internal)

- Triggered from `TaskService` on assign / status → InProgress / status → Completed
- Not exposed as a public create endpoint
