# Testing Log

## Backend Tests (xUnit)

| Test | File | Status |
|------|------|--------|
| CreateTask_WithValidData_ReturnsCreated | `TasksApiTests.cs` | ✅ Pass |
| CreateTask_WithEmptyTitle_ReturnsBadRequest | `TasksApiTests.cs` | ✅ Pass |
| GetTasks_AfterCreate_ReturnsTaskInList | `TasksApiTests.cs` | ✅ Pass |
| UpdateTaskStatus_ToInProgress_ReturnsUpdatedStatus | `TasksApiTests.cs` | ✅ Pass |
| DashboardSummary_UpdatesAfterCreate | `TasksApiTests.cs` | ✅ Pass |
| CreateTask_WithInvalidOwner_ReturnsBadRequest | `TasksApiTests.cs` | ✅ Pass |
| GetTasks_WithStatusFilter_ReturnsMatchingTasks | `TasksApiTests.cs` | ✅ Pass |
| DashboardSummary_OverdueExcludesCompleted | `TasksApiTests.cs` | ✅ Pass |
| CreateTask_CreatesActivityLogEntry | `TasksApiTests.cs` | ✅ Pass |
| UpdateTaskStatus_CreatesStatusChangeActivityLog | `TasksApiTests.cs` | ✅ Pass |
| GetTaskActivity_ForUnknownTask_ReturnsNotFound | `TasksApiTests.cs` | ✅ Pass |

| GetTasks_WithPriorityFilter_ReturnsMatchingTasks | `TasksApiTests.cs` | ✅ Pass |
| GetTasks_WithCategoryFilter_ReturnsMatchingTasks | `TasksApiTests.cs` | ✅ Pass |
| GetTasks_WithPagination_ReturnsPagedResult | `TasksApiTests.cs` | ✅ Pass |

**Run**: `cd backend && dotnet test` — 14/14 passed

## Frontend Tests (Vitest + RTL)

| Test | File | Status |
|------|------|--------|
| SummaryCards displays counts | `DashboardPage.test.tsx` | ✅ Pass |
| TaskForm validation empty title | `DashboardPage.test.tsx` | ✅ Pass |
| TaskForm submits valid data | `DashboardPage.test.tsx` | ✅ Pass |
| DashboardPage renders tasks | `DashboardPage.test.tsx` | ✅ Pass |
| DashboardPage empty state | `DashboardPage.test.tsx` | ✅ Pass |
| Status quick action PATCH | `DashboardPage.test.tsx` | ✅ Pass |
| Debounced search (list-only) | `DashboardPage.test.tsx` | ✅ Pass |
| Search button immediate apply | `DashboardPage.test.tsx` | ✅ Pass |
| Priority filter resets page 1 | `DashboardPage.test.tsx` | ✅ Pass |

**Run**: `cd frontend && npm test` — 9/9 passed

## Edge Cases Covered

| Case | Covered By |
|------|------------|
| Backend validation (empty title) | BT-02 |
| Backend validation (invalid owner) | BT invalid owner test |
| Dashboard count increment | BT-07 |
| Overdue excludes completed | BT-08 (before/after assertion) |
| Status filter | BT status filter test |
| Priority filter | GetTasks_WithPriorityFilter_ReturnsMatchingTasks |
| Category filter | GetTasks_WithCategoryFilter_ReturnsMatchingTasks |
| Pagination | GetTasks_WithPagination_ReturnsPagedResult |
| Activity log on create | CreateTask_CreatesActivityLogEntry |
| Activity log on status change | UpdateTaskStatus_CreatesStatusChangeActivityLog |
| Activity 404 for unknown task | GetTaskActivity_ForUnknownTask_ReturnsNotFound |
| Frontend empty state | FT empty test |
| Frontend form validation | TaskForm test |

## Pending Tests

- E2E test with both servers (manual)
- API error state integration test (optional)

---

*Last updated: 2026-07-09 — feature/stretch-filters-pagination*
