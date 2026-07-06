# Bug Log

> Append-only. Record every bug found and fixed.

---

## Template

```
### BUG-XXX — [Title]
- **Date**:
- **Problem**:
- **Root cause**:
- **How investigated**:
- **AI suggestion**:
- **What was accepted**:
- **What was rejected**:
- **Final solution**:
- **Files changed**:
- **Git commit**: [COMMIT_HASH_PLACEHOLDER]
```

---

### BUG-001 — Search keystroke triggers full dashboard reload

- **Date**: 2026-07-06
- **Problem**: Typing in search caused the entire dashboard to show loading skeleton on every key press
- **Root cause**: `SearchFilterContext` shared topbar and Tasks search; filter changes triggered `loadDashboard()` instead of list-only fetch
- **How investigated**: Traced `DashboardPage` effects and context consumers; reproduced with dual search inputs
- **Final solution**: Remove context and topbar search; debounced local search in `SearchFilter`; split `loadDashboard` / `loadTaskList` in `DashboardPage`
- **Files changed**: Layout, SearchFilter, DashboardPage, App.tsx, index.css, tests; deleted SearchFilterContext
- **Git commit**: `feature/fix-search-debounce`
