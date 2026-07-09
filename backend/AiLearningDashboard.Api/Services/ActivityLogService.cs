// @branch feature/stretch-activity-log
// @history 2026-07-09 — Activity log service for recording and retrieval

using AiLearningDashboard.Api.DTOs;
using AiLearningDashboard.Api.Entities;
using AiLearningDashboard.Api.Repositories;

namespace AiLearningDashboard.Api.Services;

public interface IActivityLogService
{
    Task LogAsync(
        int taskId,
        string action,
        string? previousValue,
        string? newValue,
        string user,
        CancellationToken cancellationToken = default);

    Task<List<ActivityLogDto>> GetByTaskIdAsync(int taskId, CancellationToken cancellationToken = default);
}

public class ActivityLogService(IActivityLogRepository activityLogRepository) : IActivityLogService
{
    public async Task LogAsync(
        int taskId,
        string action,
        string? previousValue,
        string? newValue,
        string user,
        CancellationToken cancellationToken = default)
    {
        var log = new ActivityLog
        {
            TaskId = taskId,
            Action = action,
            PreviousValue = previousValue,
            NewValue = newValue,
            User = user,
            Timestamp = DateTime.UtcNow
        };

        await activityLogRepository.AddAsync(log, cancellationToken);
    }

    public async Task<List<ActivityLogDto>> GetByTaskIdAsync(int taskId, CancellationToken cancellationToken = default)
    {
        var logs = await activityLogRepository.GetByTaskIdAsync(taskId, cancellationToken);
        return logs.Select(MapToDto).ToList();
    }

    private static ActivityLogDto MapToDto(ActivityLog log) => new()
    {
        Id = log.Id,
        TaskId = log.TaskId,
        Action = log.Action,
        PreviousValue = log.PreviousValue,
        NewValue = log.NewValue,
        User = log.User,
        Timestamp = log.Timestamp
    };
}
