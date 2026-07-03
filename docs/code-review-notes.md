# Code Review Notes

> Self-review and AI-assisted review findings. Updated per session.

## Review Checklist

- [ ] Controllers thin; business logic in services
- [ ] DTOs separate from entities
- [ ] No hardcoded dashboard counts
- [ ] Validation on backend and frontend
- [ ] All UI states implemented (loading, empty, success, error)
- [ ] No secrets or connection strings with passwords committed
- [ ] Tests cover core flows
- [ ] Documentation matches implementation

## Session 1 — Planning Review

### Strengths (Planned)

- Clear separation: `backend/` and `frontend/`
- SQLite reduces assessor setup friction
- Comprehensive documentation for traceability

### Items to Watch

1. **Date handling**: Ensure overdue logic uses date-only comparison consistently.
2. **Owner FK**: Validate `ownerId` exists before create/update.
3. **Refetch after mutation**: Dashboard and list must refetch to satisfy AC-08.
4. **Enum serialization**: ASP.NET Core JSON uses string enums for frontend readability.

### Suggested Improvements (Post-MVP)

- Add `react-query` for cache invalidation
- Add pagination when task count grows
- Add OpenAPI/Swagger UI link in README

## AI Review Prompt (For Later Sessions)

```
Review this diff for:
- Security issues
- Missing validation
- Hardcoded dashboard data
- Missing error handling
- Test gaps
```

## Findings Log

| Date | Severity | Finding | Status |
|------|----------|---------|--------|
| 2026-07-03 | — | Initial scaffold — no code to review yet | N/A |

---

*Formal bug fixes logged in `project-notes/bug-log.md`.*
