# Changelog

All notable changes to this project are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/).

## Git History Note

The **initial commit** (`413947a` — `Initial project setup`) exists on `main` and must not be recreated or rewritten. All subsequent work flows through `dev` and feature branches.

---

## [Unreleased]

### Added

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

---

## [0.1.0] — 2026-07-03 — Initial project setup (`main`)

### Added

- Full-stack AI Learning Dashboard (React + ASP.NET Core + SQLite)
- Backend REST API with EF Core, FluentValidation, dashboard summary
- Frontend dashboard, task CRUD, search/filter, UI states
- xUnit (6) and Vitest/RTL (6) tests
- Assessment documentation (`docs/`, `project-notes/`, `ai-prompts/`)

**Commit**: `413947a` on `main`
