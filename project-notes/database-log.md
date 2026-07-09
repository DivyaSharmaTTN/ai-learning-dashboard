# Database Log

## Database Engine

- **Provider**: SQLite
- **File**: `backend/AiLearningDashboard.Api/learningdashboard.db` (gitignored)

## Tables

### Users

| Column | Type | Constraints |
|--------|------|-------------|
| Id | INTEGER | PK, auto-increment |
| Name | TEXT | NOT NULL, max 100 |
| Email | TEXT | NOT NULL, max 200 |
| Role | TEXT | NOT NULL, max 50 |
| PasswordHash | TEXT | max 200, nullable (BCrypt for auth users) |

### ProjectTasks

| Column | Type | Constraints |
|--------|------|-------------|
| Id | INTEGER | PK |
| Title | TEXT | NOT NULL, max 200 |
| Description | TEXT | max 2000 |
| Category | TEXT | enum string |
| Priority | TEXT | enum string |
| Status | TEXT | enum string |
| OwnerId | INTEGER | FK → Users.Id, RESTRICT delete |
| DueDate | TEXT | DateTime UTC |
| CreatedAt | TEXT | UTC |
| UpdatedAt | TEXT | UTC |

### ActivityLogs

| Column | Type | Constraints |
|--------|------|-------------|
| Id | INTEGER | PK, auto-increment |
| TaskId | INTEGER | FK → ProjectTasks.Id, CASCADE delete |
| Action | TEXT | NOT NULL, max 50 (`Created`, `Updated`, `StatusChanged`) |
| PreviousValue | TEXT | max 500, nullable |
| NewValue | TEXT | max 500, nullable |
| User | TEXT | NOT NULL, max 100 |
| Timestamp | TEXT | UTC |

## Relationships

- `ProjectTasks.OwnerId` → `Users.Id` (many-to-one)
- `ActivityLogs.TaskId` → `ProjectTasks.Id` (many-to-one, cascade on task delete)

## Seed Data

| Id | Name | Email | Role |
|----|------|-------|------|
| 1 | Alex Developer | alex@example.com | Developer |
| 2 | Sam Learner | sam@example.com | Learner |
| 3 | Jordan Lead | jordan@example.com | Lead |
| 4 | Admin | admin@example.com | Admin (auth; PasswordHash set) |
| 5 | User | user@example.com | User (auth; PasswordHash set) |

**Auth passwords (dev seed):** `Admin123!`, `User123!` (BCrypt-hashed in DB)

## Migrations

| Migration | Date | Description |
|-----------|------|-------------|
| `20260703101544_InitialCreate` | 2026-07-03 | Users + ProjectTasks + seed users |
| `20260709111559_AddActivityLog` | 2026-07-09 | ActivityLogs table + FK/index (stretch) |
| `AddAuthPasswordHashAndUsers` | 2026-07-09 | PasswordHash column + Admin/User seed (stretch auth) |

## Indexes

- `IX_ProjectTasks_OwnerId` on `ProjectTasks.OwnerId`
- `IX_ActivityLogs_TaskId` on `ActivityLogs.TaskId`

## Validation Rules

- App-level: FluentValidation + EF model constraints
- FK: Owner must exist before task create/update

---

*Last updated: 2026-07-09 — feature/stretch-auth-rbac*
