# AI Prompt History — Debugging

---

## Entry 001 — Initial State

**Date**: 2026-07-03

### Prompt / Summary

No debugging sessions yet — project started from empty repository.

### Why Asked

N/A

### AI Response Summary

Created `docs/debugging-notes.md` with anticipated issues (CORS, SQLite lock, timezone).

### Files Affected

- `docs/debugging-notes.md`

### Git Commit Reference

`[COMMIT_HASH_PLACEHOLDER]` — included in initial docs commit

---

## Entry 002 — Search Keystroke Full-Page Refresh

**Date**: 2026-07-06

### Prompt / Summary

Fix search: remove duplicate topbar search, debounce task list search, avoid reloading the whole dashboard on every key press.

### Why Asked

Shared `SearchFilterContext` synced topbar and Tasks search; each keystroke updated filters and re-ran `loadDashboard()`, showing the full skeleton.

### AI Response Summary

Removed context and topbar search; `SearchFilter` keeps local input with 400ms debounce plus Enter/Search button; `DashboardPage` splits initial dashboard load from filtered list fetch.

### Files Affected

- `frontend/src/components/Layout.tsx`, `SearchFilter.tsx`, `pages/DashboardPage.tsx`
- Deleted `frontend/src/context/SearchFilterContext.tsx`
- `frontend/src/pages/DashboardPage.test.tsx`, `frontend/src/index.css`

### Git Commit Reference

`feature/fix-search-debounce` — see commit on branch

---

*Append entries when bugs are found and fixed.*
