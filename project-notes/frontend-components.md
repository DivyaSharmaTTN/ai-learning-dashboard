# Frontend Components

> Document each component as implemented.  
> **Branch**: `feature/stretch-auth-rbac` (2026-07-09 JWT auth + RBAC)

---

## AuthContext / LoginPage / ProtectedRoute / AdminRoute

- **Purpose**: JWT session management, login UI, route guards
- **API**: `POST /api/auth/login`; Bearer token on all protected API calls via `api/client.ts`
- **Storage**: `sessionStorage` key `ai-dashboard-auth`
- **Roles**: `Admin` — full UI + task CRUD; `User` — assigned task list + status updates only (no create)
- **LoginPage**: Branded card, input icons, password toggle, validation, loading state, demo accounts accordion

## ActivityHistory

- **Purpose**: Persisted audit trail on task detail (Created, Updated, StatusChanged)
- **Props**: `logs: ActivityLog[]`
- **API dependency**: `GET /api/tasks/{id}/activity`
- **Reusable**: Yes (task detail context)
- **Notes**: Distinct from dashboard `RecentActivity` (derived from task `updatedAt`, not DB audit)

## Layout

- **Purpose**: Sidebar shell + topbar with page title, theme toggle, logout, dynamic user profile
- **Props**: None (uses `useAuth()`)
- **API dependency**: None
- **Reusable**: Yes
- **Notes**: "New Task" nav and promo card visible to Admin only

## SummaryCards

- **Purpose**: 5 dashboard count cards with Lucide icons, hover lift, stagger animation
- **Props**: `summary: DashboardSummary`
- **API dependency**: `GET /api/dashboard/summary`
- **Reusable**: Yes

## SearchFilter

- **Purpose**: Keyword search + status, priority, and category filters in the Tasks section
- **Props**: `status`, `priority`, `category`, `onStatusChange`, `onPriorityChange`, `onCategoryChange`, `onSearchApply`, `onClearFilters`, `hasActiveFilters?`, `listLoading?`
- **Behavior**:
  - Local `searchInput` state (not shared with topbar or global context)
  - 400ms debounce on typing; immediate apply on Enter or Search button
  - Filter changes apply immediately to the list and reset pagination to page 1
  - Clear filters button when any filter is active
- **Reusable**: Yes

## TaskPagination

- **Purpose**: Prev/next controls and "Showing X–Y of Z" summary for paginated task list
- **Props**: `page`, `totalPages`, `totalCount`, `pageSize`, `onPageChange`, `loading?`
- **Reusable**: Yes

## TaskList / TaskListItem

- **Purpose**: Task rows with avatar, progress bar, badges, Start/Complete/View actions
- **Props**: `tasks`, `onStatusUpdated`, `onError`
- **API dependency**: `PATCH /api/tasks/{id}/status`
- **Reusable**: Yes

## TaskForm

- **Purpose**: Create/edit with validation (unchanged logic)
- **Reusable**: Yes

## Dashboard panels (`components/dashboard/`)

| Component | Purpose | Data source |
|-----------|---------|-------------|
| `TaskStatusChart` | Pie chart of status distribution | `DashboardSummary` |
| `WeeklyProgressChart` | Bar chart created vs completed | `Task[]` dates |
| `AiInsights` | Insight cards | Computed from summary + tasks |
| `RecentActivity` | Last 5 updated tasks | `Task[]` by `updatedAt` |
| `UpcomingDeadlines` | Next due tasks | `Task[]` by `dueDate` |

## UI primitives (`components/ui/`)

| Component | Purpose |
|-----------|---------|
| `Avatar` | Owner initials |
| `Skeleton` / `DashboardSkeleton` | Loading placeholders (initial dashboard load only) |
| `ThemeToggle` | Light/dark switch |
| `NotificationBell` | Topbar bell dropdown; unread badge; mark read; navigate to task |

## Context

| Provider | Purpose |
|----------|---------|
| `ThemeContext` | `data-theme` on `<html>`, localStorage |
| `ToastContext` | Animated success toasts |

## Pages

| Page | Notes |
|------|-------|
| `DashboardPage` | Split loading: `loadDashboard()` (summary + panel tasks) vs `loadTaskList()` (paginated filtered list); list overlay on refetch |
| `CreateTaskPage` | Styled form page |
| `TaskDetailPage` | Styled edit page + `ActivityHistory` audit panel |

## State components

| Component | Purpose |
|-----------|---------|
| `LoadingState` | Spinner (form pages) |
| `EmptyState` | Inbox icon + CTA |
| `ErrorState` | Alert icon + retry |

---

*Last updated: 2026-07-13 — feature/task-notifications*
