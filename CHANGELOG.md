# Changelog

All notable changes to this project are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/).

## Git History Note

The **initial commit** (`413947a` — `Initial project setup`) exists on `main` and must not be recreated or rewritten. All subsequent work flows through `dev` and feature branches.

---

## [Unreleased]

### Added

- **In-app task notifications** (`feature/task-notifications`) (2026-07-13)
  - `Notifications` table and EF migration `AddNotifications`
  - APIs: list, unread-count, mark one/all read
  - Server-side create on assign / start / complete
  - `NotificationBell` dropdown with unread badge and deep-link to task
  - 7 backend + 4 frontend tests (backend suite 29 total)
  - Prompt history: `ai-prompts/10-stretch-task-notifications.md`
  - Not merged to `dev`/`main` yet
- **Extended filters and pagination** (`feature/stretch-filters-pagination`) (2026-07-09)
  - Priority and category filters on task list (API + UI)
  - Paginated `GET /api/tasks?page=&pageSize=` with `PagedResultDto` response
  - `TaskPagination` component with prev/next and result summary
  - Clear filters button; filter changes reset to page 1
  - 3 additional backend tests (14 total); 1 additional frontend test (9 total)
- **Git workflow Cursor rule** (2026-07-09)
  - Canonical `.cursor/rules/git-workflow.mdc` (`alwaysApply: true`)
  - Append-only documentation history policy across `docs/`, `project-notes/`, `ai-prompts/`, `cursor-workflow`
  - `ai-prompts/08-git-workflow-rules.md` prompt trace entry
- **Activity log / audit history** (`feature/stretch-activity-log`)
  - `ActivityLogs` table and EF migration
  - Automatic logging on task create, update, and status change
  - `GET /api/tasks/{id}/activity` endpoint
  - `ActivityHistory` panel on task detail page
  - 3 additional backend integration tests (11 total)
- **Modern AI SaaS dashboard UI** (`feature/modern-ai-dashboard-ui`)
  - Light/dark theme with persistence
  - Premium summary cards with Lucide icons, hover effects, animations
  - Recharts: task status pie chart, weekly progress bar chart
  - AI Insights, Recent Activity, Upcoming Deadlines (derived from real API data)
  - Redesigned task cards with progress bars, avatars, badges
  - Sidebar layout, loading skeletons, enhanced toasts and empty/error states
  - Default dark Synaptix-style glassmorphism theme
- Browser tab and sidebar brand show **Dashboard** (not "frontend")

### Added (prior)

- Git workflow documentation: `dev` branch, feature-branch policy, no direct commits to `main`
- Root docs: `ARCHITECTURE.md`, `CHANGELOG.md`, `TASKS.md`

### Changed

- Updated README with Git workflow section
- Updated Cursor workflow and project notes to reflect branch strategy
- **Task search behavior** (`feature/fix-search-debounce`)
  - Removed duplicate topbar search; page title shown in topbar instead
  - Tasks section search uses local state with 400ms debounce, Enter, and Search button
  - Dashboard panels load once; only the task list refetches on search/filter changes
  - Status filter preserved independently; list shows inline loading overlay (no full-page skeleton)

### Fixed

- Full-page refresh feel on every search keystroke (shared filter context triggered `loadDashboard()`)

---

## [0.1.0] — 2026-07-03 — Initial project setup (`main`)

### Added

- Full-stack AI Learning Dashboard (React + ASP.NET Core + SQLite)
- Backend REST API with EF Core, FluentValidation, dashboard summary
- Frontend dashboard, task CRUD, search/filter, UI states
- xUnit (6) and Vitest/RTL (6) tests
- Assessment documentation (`docs/`, `project-notes/`, `ai-prompts/`)

**Commit**: `413947a` on `main`
