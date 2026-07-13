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

| Login_WithValidAdminCredentials_ReturnsToken | `AuthApiTests.cs` | ✅ Pass |
| Login_WithValidUserCredentials_ReturnsToken | `AuthApiTests.cs` | ✅ Pass |
| Login_WithInvalidPassword_ReturnsUnauthorized | `AuthApiTests.cs` | ✅ Pass |
| GetTasks_WithoutToken_ReturnsUnauthorized | `AuthApiTests.cs` | ✅ Pass |
| DashboardSummary_AsUser_ReturnsForbidden | `AuthApiTests.cs` | ✅ Pass |
| CreateTask_AsUser_ReturnsForbidden | `AuthApiTests.cs` | ✅ Pass |
| User_CanViewOnlyAssignedTasks | `AuthApiTests.cs` | ✅ Pass |
| User_CanUpdateStatusOnOwnTask_ButNotOthers | `AuthApiTests.cs` | ✅ Pass |

**Run**: `cd backend && dotnet test` — 22/22 passed (task tests use admin JWT via `AuthTestHelper`)

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
| LoginPage renders sign in form | `LoginPage.test.tsx` | ✅ Pass |
| LoginPage validation + password toggle | `LoginPage.test.tsx` | ✅ Pass |
| LoginPage calls login on submit | `LoginPage.test.tsx` | ✅ Pass |
| User empty state without create CTA | `DashboardPage.test.tsx` | ✅ Pass |

**Run**: `cd frontend && npm test` — 14/14 passed

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
| JWT login valid/invalid | AuthApiTests |
| Unauthorized without token | GetTasks_WithoutToken_ReturnsUnauthorized |
| User forbidden on admin endpoints | DashboardSummary_AsUser, CreateTask_AsUser |
| User scoped task list + status | User_CanViewOnlyAssignedTasks, User_CanUpdateStatusOnOwnTask |
| Frontend empty state | FT empty test |
| Frontend form validation | TaskForm test |

## Pending Tests

- E2E test with both servers (manual)
- API error state integration test (optional)

---

## 2026-07-13 — feature/task-notifications

| Case | Covered By |
|------|------------|
| Assign → User notified | `CreateTask_AssignedToUser_NotifiesRecipient` |
| Start → Admin notified | `UserStartsTask_NotifiesAdmin` |
| Complete → Admin notified | `UserCompletesTask_NotifiesAdmin` |
| Mark one / mark all read | `MarkAsRead_*`, `MarkAllAsRead_*` |
| Cross-user mark-read forbid | `MarkAsRead_OtherUsersNotification_ReturnsForbid` |
| Unauth notifications | `GetNotifications_Unauthenticated_ReturnsUnauthorized` |
| Bell UI + navigate | `NotificationBell.test.tsx` (4 tests) |

**Totals after this feature:** backend 29 passed; NotificationBell 4 passed.

---

*Last updated: 2026-07-13 — feature/task-notifications*
