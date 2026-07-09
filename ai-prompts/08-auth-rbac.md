# AI Prompt — JWT Authentication and RBAC (Stretch)

> Branch: `feature/stretch-auth-rbac` | Date: 2026-07-09

## User Prompt Summary

Implement JWT Authentication and Role-Based Authorization using `Microsoft.AspNetCore.Authentication.JwtBearer` and `BCrypt.Net-Next`. Add login API, seed Admin/User accounts, protect APIs with `[Authorize]`, add frontend login/logout/protected routes/role UI, auth tests, and documentation updates.

## What AI Suggested

- Reuse existing `User.Role` column for ASP.NET roles (`Admin`, `User`) alongside legacy job roles (`Developer`, `Learner`, `Lead`)
- Add nullable `PasswordHash` on `User`; seed auth users as Id 4 (Admin) and Id 5 (User)
- Store JWT secret in `appsettings.Development.json` with `appsettings.Development.local.json.example` for overrides; support `Jwt__Key` env var
- Filter tasks by `OwnerId` in repository for non-admin users
- Frontend `AuthContext` with `sessionStorage`; `ProtectedRoute` + `AdminRoute`
- Test factory uses `UseEnvironment("Testing")` + `UseSetting("Jwt:Key", ...)` for consistent signing/validation

## What Was Accepted

- All of the above
- Admin: full CRUD + dashboard summary + users list
- User: view own tasks, PATCH status on own tasks only
- Read-only `TaskForm` on task detail for User role
- 8 new backend auth tests; existing 14 task tests updated with admin auth helper

## What Was Rejected

- Replacing legacy seed users (kept Alex/Sam/Jordan for backward compatibility)
- Committing production JWT secrets

## Reason

Preserve existing task owner references and tests while adding stretch auth without breaking prior functionality.

## Suggested Commit Message

```
feat(auth): add JWT login and role-based access control

Seed Admin/User accounts with BCrypt hashes, protect APIs with JWT Bearer,
and add frontend login, protected routes, and role-based UI.
```

## Files Created

**Backend:** `AuthController.cs`, `AuthService.cs`, `AuthDtos.cs`, `AuthRoles.cs`, `JwtSettings.cs`, `ClaimsPrincipalExtensions.cs`, migration `AddAuthPasswordHashAndUsers`

**Frontend:** `auth.ts`, `AuthContext.tsx`, `ProtectedRoute.tsx`, `AdminRoute.tsx`, `LoginPage.tsx`, `LoginPage.test.tsx`

**Docs:** `ai-prompts/08-auth-rbac.md`, `appsettings.Development.local.json.example`

## Files Modified

Backend controllers, `User.cs`, `AppDbContext`, `Program.cs`, `TaskService`, `TaskRepository`, `TaskListQuery`, `UserRepository`, `appsettings.json`, `appsettings.Development.json`, `.gitignore`, all test files

Frontend: `App.tsx`, `Layout.tsx`, `client.ts`, `DashboardPage.tsx`, `TaskDetailPage.tsx`, `TaskForm.tsx`, `index.css`, `DashboardPage.test.tsx`

## Database Changes

- `Users.PasswordHash` column (nullable, max 200)
- Seeded users: `admin@example.com` (Admin), `user@example.com` (User) with BCrypt hashes

## API Changes

- `POST /api/auth/login` — returns JWT + user (anonymous)
- All task/dashboard/user endpoints require JWT
- Role policies: Admin full access; User scoped to owned tasks + status PATCH

## Frontend Changes

- Login page at `/login`
- Protected app routes; `/tasks/new` admin-only
- Bearer token on all API calls; logout button; role-based nav and dashboard panels

## Tests Added/Updated

- Backend: `AuthApiTests.cs` (8 tests), `AuthTestHelper.cs`; `TasksApiTests` auth-wrapped — 22/22 pass
- Frontend: `LoginPage.test.tsx`; `DashboardPage.test.tsx` auth mock — 11/11 pass

---

## Review Follow-up (2026-07-09)

### User role — task creation

**Requirement verified:** Only **Admin** may create tasks (`POST /api/tasks` is `[Authorize(Roles = Admin)]`). User role is view assigned tasks + status PATCH only.

**Fix:** User empty state no longer suggests "Create a new task". Shows "No assigned tasks" with message to contact an admin. Login page footer documents role permissions. No backend change — permissions were already correct.

### Login UI redesign

- Centered card with branding (Zap logo, "AI Learning Dashboard")
- Input icons, show/hide password toggle, client-side validation
- Loading spinner on submit, accessible labels/ARIA
- Collapsible demo accounts section; responsive mobile layout

### Tests

- Frontend: 14/14 pass (validation, password toggle, user empty state)
