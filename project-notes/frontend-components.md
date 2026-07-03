# Frontend Components

## Layout

- **Purpose**: App shell with header nav and `<Outlet />`
- **Props**: None
- **API dependency**: None
- **State**: None
- **Reusable**: Yes

## SummaryCards

- **Purpose**: Display 5 dashboard count cards
- **Props**: `summary: DashboardSummary`
- **API dependency**: Data from `GET /api/dashboard/summary` (via parent)
- **State**: Presentational
- **Reusable**: Yes

## SearchFilter

- **Purpose**: Keyword search + status dropdown
- **Props**: `filters`, `onChange`
- **API dependency**: None (parent refetches tasks)
- **Reusable**: Yes

## TaskList / TaskListItem

- **Purpose**: Render task rows with quick Start/Complete actions
- **Props**: `tasks`, `onStatusUpdated`, `onError`
- **API dependency**: `PATCH /api/tasks/{id}/status`
- **Reusable**: Yes

## TaskForm

- **Purpose**: Create and edit tasks with client-side validation
- **Props**: `users`, `initialValues?`, `submitLabel`, `onSubmit`, `onCancel?`
- **API dependency**: Indirect via parent (`POST`/`PUT`)
- **State**: Form values, errors, submitting
- **Reusable**: Yes

## DashboardPage

- **Purpose**: Main dashboard — summary, filters, list, UI states
- **API dependency**: `GET /api/dashboard/summary`, `GET /api/tasks`
- **State**: summary, tasks, filters, loading, error
- **Reusable**: No (page)

## CreateTaskPage / TaskDetailPage

- **Purpose**: Task create and edit routes
- **API dependency**: `GET /api/users`, `POST`/`GET`/`PUT /api/tasks`
- **Reusable**: No (pages)

## LoadingState / EmptyState / ErrorState

- **Purpose**: Standard UI states per assessment requirements
- **Reusable**: Yes

## ToastProvider (context)

- **Purpose**: Success toast messages after create/update
- **Reusable**: Yes (app-level)

---

*Last updated: 2026-07-03*
