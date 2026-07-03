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

## Relationships

- `ProjectTasks.OwnerId` → `Users.Id` (many-to-one)

## Seed Data

| Id | Name | Email | Role |
|----|------|-------|------|
| 1 | Alex Developer | alex@example.com | Developer |
| 2 | Sam Learner | sam@example.com | Learner |
| 3 | Jordan Lead | jordan@example.com | Lead |

## Migrations

| Migration | Date | Description |
|-----------|------|-------------|
| `20260703101544_InitialCreate` | 2026-07-03 | Users + ProjectTasks + seed users |

## Indexes

- `IX_ProjectTasks_OwnerId` on `ProjectTasks.OwnerId`

## Validation Rules

- App-level: FluentValidation + EF model constraints
- FK: Owner must exist before task create/update

---

*Last updated: 2026-07-03*
