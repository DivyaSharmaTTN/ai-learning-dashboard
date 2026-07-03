# Acceptance Criteria

Each criterion maps to a testable outcome for the assessment submission.

## Task CRUD

### AC-01: Create Task

- **Given** the create task form is open
- **When** the user submits valid required fields (title, category, priority, status, owner, due date)
- **Then** a new task is persisted in the database
- **And** the user sees a success message
- **And** the task appears in the task list
- **And** dashboard counts refresh

### AC-02: List Tasks

- **Given** tasks exist in the database
- **When** the user opens the dashboard/task list
- **Then** all tasks are displayed with key fields (title, status, priority, owner, due date)

### AC-03: View Task Detail

- **Given** a task exists
- **When** the user clicks/opens a task
- **Then** full task details are shown (all fields)

### AC-04: Update Task

- **Given** a task detail/edit view is open
- **When** the user changes title, description, priority, status, owner, or due date and saves
- **Then** changes persist after page refresh
- **And** `updatedAt` reflects the change

### AC-05: Mark In Progress

- **Given** a task with status `NotStarted`
- **When** the user marks it In Progress (quick action or form)
- **Then** status becomes `InProgress` in DB and UI

### AC-06: Mark Completed

- **Given** a task not completed
- **When** the user marks it Completed
- **Then** status becomes `Completed` and it no longer counts as overdue

## Dashboard

### AC-07: Summary Cards

- **Given** tasks in various states
- **When** the dashboard loads
- **Then** cards show: Total, Completed, In Progress, Overdue, High Priority
- **And** values match backend `/api/dashboard/summary` response

### AC-08: No Hardcoded Counts

- **Given** tasks are added or updated
- **When** dashboard reloads or refetches
- **Then** counts change accordingly (verified by integration test)

### AC-09: Overdue Logic

- **Given** a task with `dueDate < today` and status ≠ `Completed`
- **Then** it is counted in overdue
- **Given** a completed task with past due date
- **Then** it is NOT counted in overdue

## Search & Filter

### AC-10: Keyword or Status Filter

- **Given** multiple tasks
- **When** user enters a keyword or selects a status filter
- **Then** the list shows only matching tasks

## Validation

### AC-11: Frontend Validation

- **When** required fields are empty on submit
- **Then** inline errors appear and no API call is made (or API errors are shown)

### AC-12: Backend Validation

- **When** invalid data is sent to API (empty title, invalid ownerId)
- **Then** API returns 400 with validation errors

## UI States

### AC-13: Loading

- **While** data is fetching
- **Then** a loading indicator is shown

### AC-14: Empty

- **When** no tasks match filter or DB is empty
- **Then** an empty state message is shown

### AC-15: Error

- **When** API fails
- **Then** an error state with retry or message is shown

### AC-16: Success

- **When** create/update succeeds
- **Then** a success toast or message appears

## Persistence

### AC-17: Database Survival

- **Given** tasks created
- **When** API restarts
- **Then** tasks still exist

## Testing

### AC-18: Backend Tests

- xUnit tests cover create, validation, dashboard counts, status update

### AC-19: Frontend Tests

- RTL tests cover create flow, list update, status change, dashboard count display

## Documentation

### AC-20: Docs Match Code

- API contract, project memory, and component docs reflect current implementation
