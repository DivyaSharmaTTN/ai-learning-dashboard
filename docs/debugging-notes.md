# Debugging Notes

> Living document — append entries as issues are discovered and resolved.

## Environment Setup

### Backend not starting

- Verify .NET SDK: `dotnet --version`
- Run from `backend/AiLearningDashboard.Api`: `dotnet run`
- Check port conflicts on 5000/5001

### Frontend cannot reach API

- Confirm API is running
- Check browser console for CORS errors → verify `Program.cs` CORS policy includes `http://localhost:5173`
- Verify `VITE_API_URL` in `frontend/.env` matches API base URL

### SQLite database locked

- Stop duplicate API instances
- Delete `learningdashboard.db` only in dev to reset (migrations will recreate)

## Common Issues (Anticipated)

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Dashboard counts always zero | API not called or wrong endpoint | Check network tab; verify `DashboardService` queries |
| Overdue count wrong | Timezone/date comparison | Use `.Date` on UTC consistently |
| 400 on create | Missing required field | Check validation messages in response body |
| Tasks disappear after restart | DB not persisted | Ensure SQLite file path is stable, not in-memory in prod |

## Debugging Session Template

```
### [DATE] Issue title
**Problem**:
**Root cause**:
**Investigation**:
**Solution**:
**Files changed**:
**Commit**: [placeholder]
```

## Session 1

No runtime bugs yet — repository was empty at project start.

---

*See also `project-notes/bug-log.md` for formal bug tracking.*
