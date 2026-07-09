# AI Prompt History — Git Workflow Rules

---

## Entry 008 — Adopt Canonical Git Workflow Rule

**Date**: 2026-07-09

**Branch**: `docs/git-workflow-rules` (suggested; work may land on current feature branch)

### Prompt / Summary

User requested: read and follow `.cursor/rules/git-workflow.mdc` for the entire project. From now on, whenever creating a branch or making any code/documentation change, update respective docs, project-notes, ai-prompts, and cursor-workflow files. Always append history and never overwrite previous entries.

### Why Asked

Ensure consistent branch discipline and documentation traceability across all future agent sessions.

### AI Response Summary

- Installed canonical rule at `.cursor/rules/git-workflow.mdc` (`alwaysApply: true`)
- Converted `ai-prompts/.cursor/rules/git-workflow.mdc` to pointer (avoid duplicate drift)
- Synced `tool-specific/cursor-workflow/*`, `project-notes/*`, `CHANGELOG`, `README`
- Created this prompt history file (`08-git-workflow-rules.md`)

### What Was Accepted

- Root `.cursor/rules/` as single source of truth for Cursor
- Append-only history in all logs
- End-of-task summary checklist from the rule file

### What Was Changed

- Canonical rule path; workflow docs updated to reference it

### What Was Rejected

- N/A

### Reason

Cursor reads `alwaysApply` rules from `.cursor/rules/` at repo root; duplicate editable copies would drift.

### Suggested Commit Message

```
docs(cursor): adopt canonical git-workflow rule and sync workflow docs

- Add .cursor/rules/git-workflow.mdc (alwaysApply)
- Point ai-prompts/.cursor copy to canonical rule
- Append FL-008, DL-007, prompt entry 008, workflow file updates
```

### Status

Complete

---

*Append new workflow/process entries below.*
