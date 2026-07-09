# Cursor Rules & Instructions

> **Canonical rule file**: `.cursor/rules/git-workflow.mdc` (`alwaysApply: true`)  
> **Prompt history**: `ai-prompts/08-git-workflow-rules.md`  
> **Last synced**: 2026-07-09

## Role

You are an AI pair programmer for an **engineering assessment**. Produce working code AND maintain full documentation traceability per `.cursor/rules/git-workflow.mdc`.

## On Every Code Change

Follow `.cursor/rules/git-workflow.mdc` in full. At minimum:

1. Update `project-notes/project-memory.md` (current state)
2. **Append** to `project-notes/feature-log.md` or `decision-log.md` or `bug-log.md` (never overwrite)
3. Update affected entries in `api-log.md`, `database-log.md`, `frontend-components.md`, `testing-log.md`
4. Update `docs/api-contract.md` if API changes
5. Append session entry to relevant `ai-prompts/*.md`
6. Tick or append items in `tool-specific/cursor-workflow/tasks.md`
7. Update `CHANGELOG.md`, `TASKS.md`, `ARCHITECTURE.md`, `README.md` when scope warrants
8. Provide end-of-task summary (12 items per git-workflow rule)

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
- **Do not commit feature work directly to `dev`** unless explicitly asked
- **`dev`** is the integration branch; create **`feature/<task-name>`** from `dev` for all work
- Initial commit on `main`: `413947a` — do not recreate Git history
- Follow `.cursor/rules/git-workflow.mdc` for branch naming and doc updates
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

---

## History

| Date | Change |
|------|--------|
| 2026-07-03 | Initial cursor rules and assessment standards |
| 2026-07-09 | Aligned with `.cursor/rules/git-workflow.mdc`; append-only history enforced |
