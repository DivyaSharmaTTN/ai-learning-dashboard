# API Log

> Living endpoint documentation.

---

## GET `/api/users`

- **Purpose**: Return seeded users for owner dropdown
- **Request**: None
- **Response 200**: `[{ id, name, email, role }]`
- **Validation**: N/A
- **Used by**: `CreateTaskPage`, `TaskDetailPage`, `TaskForm`

---

## GET `/api/tasks`

- **Purpose**: List tasks with optional search/status filter
- **Query**: `search` (string), `status` (NotStarted|InProgress|Completed)
- **Response 200**: Array of `TaskDto` with `isOverdue` computed
- **Used by**: `DashboardPage`, `TaskList`

---

## GET `/api/tasks/{id}`

- **Purpose**: Single task detail
- **Response 200**: `TaskDto` | **404**: not found
- **Used by**: `TaskDetailPage`

---

## GET `/api/tasks/{id}/activity`

- **Purpose**: Audit history for a task (stretch: activity log)
- **Response 200**: `[{ id, taskId, action, previousValue, newValue, user, timestamp }]`
- **Response 404**: Task not found
- **Actions logged**: `Created`, `Updated`, `StatusChanged` (on POST/PUT/PATCH task)
- **User field**: Task owner name until JWT auth is added
- **Used by**: `TaskDetailPage`, `ActivityHistory`

---

## POST `/api/tasks`

- **Purpose**: Create task
- **Body**: `CreateTaskDto` (title, description?, category, priority, status, ownerId, dueDate)
- **Validation**: FluentValidation — required fields, enum values, ownerId > 0; service validates owner exists
- **Response 201**: Created `TaskDto`
- **Used by**: `CreateTaskPage`, `TaskForm`

---

## PUT `/api/tasks/{id}`

- **Purpose**: Full task update
- **Body**: `UpdateTaskDto`
- **Validation**: Same as POST
- **Response 200**: Updated `TaskDto` | **404** | **400**
- **Used by**: `TaskDetailPage`, `TaskForm`

---

## PATCH `/api/tasks/{id}/status`

- **Purpose**: Quick status change (In Progress / Completed)
- **Body**: `{ "status": "InProgress" }`
- **Validation**: Valid enum required
- **Response 200**: Updated `TaskDto`
- **Used by**: `TaskListItem` Start/Complete buttons

---

## GET `/api/dashboard/summary`

- **Purpose**: Dashboard counts from DB queries (not hardcoded)
- **Response 200**: `{ totalItems, completedItems, inProgressItems, overdueItems, highPriorityItems }`
- **Overdue rule**: `dueDate.Date < UtcNow.Date && status != Completed`
- **Used by**: `SummaryCards`, `DashboardPage`

---

*Last updated: 2026-07-09*
