# Frontend Components

> Document each component as implemented.  
> **Branch**: `feature/modern-ai-dashboard-ui` (2026-07-03 UI overhaul)

---

## Layout

- **Purpose**: Sidebar shell + topbar with theme toggle
- **Props**: None
- **API dependency**: None
- **Reusable**: Yes

## SummaryCards

- **Purpose**: 5 dashboard count cards with Lucide icons, hover lift, stagger animation
- **Props**: `summary: DashboardSummary`
- **API dependency**: `GET /api/dashboard/summary`
- **Reusable**: Yes

## SearchFilter

- **Purpose**: Keyword search + status filter with Search/Filter icons
- **Props**: `filters`, `onChange`
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
| `Skeleton` / `DashboardSkeleton` | Loading placeholders |
| `ThemeToggle` | Light/dark switch |

## Context

| Provider | Purpose |
|----------|---------|
| `ThemeContext` | `data-theme` on `<html>`, localStorage |
| `ToastContext` | Animated success toasts |

## Pages

| Page | Notes |
|------|-------|
| `DashboardPage` | Full dashboard grid + skeleton loading |
| `CreateTaskPage` | Styled form page |
| `TaskDetailPage` | Styled edit page |

## State components

| Component | Purpose |
|-----------|---------|
| `LoadingState` | Spinner (form pages) |
| `EmptyState` | Inbox icon + CTA |
| `ErrorState` | Alert icon + retry |

---

*Last updated: 2026-07-03 — feature/modern-ai-dashboard-ui*
