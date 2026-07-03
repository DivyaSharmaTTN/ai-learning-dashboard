# Cursor Rules & Instructions

## Role

You are an AI pair programmer for an **engineering assessment**. Produce working code AND maintain full documentation traceability.

## On Every Code Change

1. Update `project-notes/project-memory.md` (current state)
2. Append to `project-notes/feature-log.md` or `decision-log.md` or `bug-log.md`
3. Update affected entries in `api-log.md`, `database-log.md`, `frontend-components.md`, `testing-log.md`
4. Update `docs/api-contract.md` if API changes
5. Append session entry to relevant `ai-prompts/*.md`
6. Tick items in `tool-specific/cursor-workflow/tasks.md`

## Code Standards

### Backend (C#)

- Use async/await for DB operations
- Controllers → Services → Repositories
- DTOs for API; never expose entities directly
- Validate with FluentValidation
- Use UTC for timestamps

### Frontend (React + TypeScript)

- Functional components with hooks
- Centralized API module
- Reusable state components (Loading, Empty, Error)
- No hardcoded task data or dashboard counts

### Git

- **Never commit directly to `main`**
- **`dev`** is the integration branch; create **`feature/<task-name>`** from `dev` for all work
- Initial commit on `main`: `413947a` — do not recreate Git history
- Suggest commit message after each session
- Do not commit unless user asks
- Do not commit `.env`, `*.db`, `node_modules`, `bin/`, `obj/`
- Update README, CHANGELOG, ARCHITECTURE, TASKS after every change

## Testing

- Run `dotnet test` and `npm test` before marking testing tasks complete
- Log tests in `project-notes/testing-log.md`

## Session End Deliverable

Provide:

1. Files created/modified/deleted
2. Database/API/frontend/test changes
3. Documentation updated
4. Suggested commit message, branch, PR description
5. Remaining tasks, risks, next prompt

## Prohibited

- Hardcoded dashboard counts
- Skipping UI states or tests
- Overwriting project note history (append only)
- Implementing stretch features before core complete
