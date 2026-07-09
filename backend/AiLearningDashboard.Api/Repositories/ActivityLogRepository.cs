// @branch feature/stretch-activity-log
// @history 2026-07-09 — EF repository for activity log read/write

using AiLearningDashboard.Api.Data;
using AiLearningDashboard.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace AiLearningDashboard.Api.Repositories;

public interface IActivityLogRepository
{
    Task AddAsync(ActivityLog log, CancellationToken cancellationToken = default);
    Task<List<ActivityLog>> GetByTaskIdAsync(int taskId, CancellationToken cancellationToken = default);
}

public class ActivityLogRepository(AppDbContext dbContext) : IActivityLogRepository
{
    public async Task AddAsync(ActivityLog log, CancellationToken cancellationToken = default)
    {
        dbContext.ActivityLogs.Add(log);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<ActivityLog>> GetByTaskIdAsync(int taskId, CancellationToken cancellationToken = default)
    {
        return await dbContext.ActivityLogs
            .AsNoTracking()
            .Where(l => l.TaskId == taskId)
            .OrderByDescending(l => l.Timestamp)
            .ToListAsync(cancellationToken);
    }
}
