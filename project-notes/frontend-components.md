# Frontend Components

> Document each component as implemented.  
> **Branch**: `feature/fix-search-debounce` (2026-07-06 search fix)

---

## Layout

- **Purpose**: Sidebar shell + topbar with page title, theme toggle, notifications placeholder, user profile
- **Props**: None
- **API dependency**: None
- **Reusable**: Yes
- **Notes**: Topbar no longer includes a search input (removed duplicate of Tasks section search)

## SummaryCards

- **Purpose**: 5 dashboard count cards with Lucide icons, hover lift, stagger animation
- **Props**: `summary: DashboardSummary`
- **API dependency**: `GET /api/dashboard/summary`
- **Reusable**: Yes

## SearchFilter

- **Purpose**: Independent keyword search + status filter in the Tasks section
- **Props**: `status`, `onStatusChange`, `onSearchApply`, `listLoading?`
- **Behavior**:
  - Local `searchInput` state (not shared with topbar or global context)
  - 400ms debounce on typing; immediate apply on Enter or Search button
  - Status filter changes apply immediately to the list
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

## Context

| Provider | Purpose |
|----------|---------|
| `ThemeContext` | `data-theme` on `<html>`, localStorage |
| `ToastContext` | Animated success toasts |

## Pages

| Page | Notes |
|------|-------|
| `DashboardPage` | Split loading: `loadDashboard()` (summary + panel tasks) vs `loadTaskList()` (filtered list only); list overlay on refetch |
| `CreateTaskPage` | Styled form page |
| `TaskDetailPage` | Styled edit page |

## State components

| Component | Purpose |
|-----------|---------|
| `LoadingState` | Spinner (form pages) |
| `EmptyState` | Inbox icon + CTA |
| `ErrorState` | Alert icon + retry |

---

*Last updated: 2026-07-06 — feature/fix-search-debounce*
