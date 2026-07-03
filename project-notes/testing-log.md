# Testing Log

## Backend Tests (xUnit)

| Test | File | Status |
|------|------|--------|
| CreateTask_WithValidData_ReturnsCreated | `TasksApiTests.cs` | ✅ Pass |
| CreateTask_WithEmptyTitle_ReturnsBadRequest | `TasksApiTests.cs` | ✅ Pass |
| GetTasks_AfterCreate_ReturnsTaskInList | `TasksApiTests.cs` | ✅ Pass |
| UpdateTaskStatus_ToInProgress_ReturnsUpdatedStatus | `TasksApiTests.cs` | ✅ Pass |
| DashboardSummary_UpdatesAfterCreate | `TasksApiTests.cs` | ✅ Pass |
| DashboardSummary_OverdueExcludesCompleted | `TasksApiTests.cs` | ✅ Pass |

**Run**: `cd backend && dotnet test` — 6/6 passed (2026-07-03)

## Frontend Tests (Vitest + RTL)

| Test | File | Status |
|------|------|--------|
| SummaryCards displays counts | `DashboardPage.test.tsx` | ✅ Pass |
| TaskForm validation empty title | `DashboardPage.test.tsx` | ✅ Pass |
| TaskForm submits valid data | `DashboardPage.test.tsx` | ✅ Pass |
| DashboardPage renders tasks | `DashboardPage.test.tsx` | ✅ Pass |
| DashboardPage empty state | `DashboardPage.test.tsx` | ✅ Pass |
| Status quick action PATCH | `DashboardPage.test.tsx` | ✅ Pass |

**Run**: `cd frontend && npm test` — 6/6 passed (2026-07-03)

## Edge Cases Covered

| Case | Covered By |
|------|------------|
| Backend validation (empty title) | BT-02 |
| Dashboard count increment | BT-07 |
| Overdue excludes completed | BT-08 |
| Frontend empty state | FT empty test |
| Frontend form validation | TaskForm test |

## Pending Tests

- E2E test with both servers (manual)
- API error state integration test (optional)

---

*Last updated: 2026-07-03*
