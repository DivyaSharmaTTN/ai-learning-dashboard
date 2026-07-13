# API Contract

> **Status**: Implemented — matches running API (2026-07-09; activity log stretch added)

**Base URL (development)**: `http://localhost:5000` or `https://localhost:5001`

**Content-Type**: `application/json`

---

## Users

### GET `/api/users`

Returns seeded users for owner selection.

**Response 200**

```json
[
  {
    "id": 1,
    "name": "Alex Developer",
    "email": "alex@example.com",
    "role": "Developer"
  }
]
```

---

## Tasks

### GET `/api/tasks`

List tasks with optional filters.

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Keyword match in title/description (optional) |
| `status` | string | Filter by status: `NotStarted`, `InProgress`, `Completed` (optional) |
| `priority` | string | Filter by priority: `Low`, `Medium`, `High` (optional) |
| `category` | string | Filter by category: `Learning`, `Project`, `Certification`, `Other` (optional) |
| `page` | int | Page number (1-based). When provided, response is paginated (optional) |
| `pageSize` | int | Items per page (default 10, max 100). Used with `page` (optional) |

**Response 200 (no `page` param)**

Returns a flat array of tasks (backward compatible for dashboard panels):

```json
[
  {
    "id": 1,
    "title": "Learn React hooks",
    "description": "Complete hooks chapter",
    "category": "Learning",
    "priority": "High",
    "status": "InProgress",
    "ownerId": 1,
    "ownerName": "Alex Developer",
    "dueDate": "2026-07-15T00:00:00Z",
    "createdAt": "2026-07-01T10:00:00Z",
    "updatedAt": "2026-07-03T08:00:00Z",
    "isOverdue": false
  }
]
```

**Response 200 (with `page` param)**

Returns a paginated envelope:

```json
{
  "items": [ /* TaskDto[] */ ],
  "totalCount": 42,
  "page": 1,
  "pageSize": 10,
  "totalPages": 5
}
```

### GET `/api/tasks/{id}`

**Response 200**: Single task object (same shape as list item).

**Response 404**: Task not found.

### GET `/api/tasks/{id}/activity`

Returns persisted audit history for a task (stretch: activity log).

**Response 200**

```json
[
  {
    "id": 1,
    "taskId": 5,
    "action": "Created",
    "previousValue": null,
    "newValue": "Learn React hooks",
    "user": "Alex Developer",
    "timestamp": "2026-07-09T10:00:00Z"
  },
  {
    "id": 2,
    "taskId": 5,
    "action": "StatusChanged",
    "previousValue": "NotStarted",
    "newValue": "InProgress",
    "user": "Alex Developer",
    "timestamp": "2026-07-09T11:30:00Z"
  }
]
```

**Actions**: `Created`, `Updated`, `StatusChanged` — written automatically on POST/PUT/PATCH task.

**Response 404**: Task not found.

### POST `/api/tasks`

Create a new task.

**Request body**

```json
{
  "title": "Build API",
  "description": "Optional description",
  "category": "Project",
  "priority": "Medium",
  "status": "NotStarted",
  "ownerId": 1,
  "dueDate": "2026-07-20"
}
```

**Validation**

| Field | Rules |
|-------|-------|
| title | Required, max 200 chars |
| category | Required |
| priority | Required, valid enum |
| status | Required, valid enum |
| ownerId | Required, must exist |
| dueDate | Required, valid date |
| description | Optional, max 2000 chars |

**Response 201**: Created task with `Location` header.

**Response 400**: Validation errors.

### PUT `/api/tasks/{id}`

Full update of task fields.

**Request body**: Same as POST (all updatable fields).

**Response 200**: Updated task.

**Response 404**: Not found.

**Response 400**: Validation errors.

### PATCH `/api/tasks/{id}/status`

Update status only (quick actions).

**Request body**

```json
{
  "status": "InProgress"
}
```

**Response 200**: Updated task.

**Response 404**: Not found.

**Response 400**: Invalid status.

---

## Notifications

> Added 2026-07-13 — `feature/task-notifications`

### GET `/api/notifications`

Returns the current user's notifications (newest first). Requires JWT.

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| `unreadOnly` | bool | When `true`, return only unread items (optional) |

**Response 200**

```json
[
  {
    "id": 1,
    "recipientUserId": 5,
    "taskId": 12,
    "message": "A new task has been assigned to you.",
    "type": "TaskAssigned",
    "isRead": false,
    "createdAt": "2026-07-13T10:00:00Z"
  }
]
```

**Types:** `TaskAssigned` | `TaskStarted` | `TaskCompleted`

### GET `/api/notifications/unread-count`

**Response 200**

```json
{ "count": 2 }
```

### PATCH `/api/notifications/{id}/read`

Marks one notification as read for the current user.

**Response 204** | **404** not found | **403** not recipient

### POST `/api/notifications/read-all`

Marks all of the current user's notifications as read.

**Response 204**

**Creation rules (server-side only)**

- Admin creates/reassigns task → notify new owner: `"A new task has been assigned to you."`
- Status → `InProgress` → notify all Admins: `"<User Name> started <Task Title>."`
- Status → `Completed` → notify all Admins: `"<User Name> completed <Task Title>."`

---

## Dashboard

### GET `/api/dashboard/summary`

Aggregated counts from database records.

**Response 200**

```json
{
  "totalItems": 10,
  "completedItems": 3,
  "inProgressItems": 4,
  "overdueItems": 2,
  "highPriorityItems": 5
}
```

**Rules**

- `overdueItems`: `dueDate < today (UTC date)` AND `status != Completed`
- `highPriorityItems`: `priority == High` (all statuses unless specified otherwise)
- Counts are never hardcoded; computed via EF queries

---

## Error Response Shape

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Title": ["Title is required."]
  }
}
```

---

## Frontend Usage Map

| Endpoint | Component/Page |
|----------|----------------|
| GET `/api/dashboard/summary` | `SummaryCards`, `DashboardPage` |
| GET `/api/tasks` | `TaskList`, `DashboardPage` |
| GET `/api/tasks/{id}` | `TaskDetailPage` |
| POST `/api/tasks` | `CreateTaskPage`, `TaskForm` |
| PUT `/api/tasks/{id}` | `TaskDetailPage`, `TaskForm` |
| PATCH `/api/tasks/{id}/status` | `TaskListItem` quick actions |
| GET `/api/users` | `TaskForm` owner dropdown |
