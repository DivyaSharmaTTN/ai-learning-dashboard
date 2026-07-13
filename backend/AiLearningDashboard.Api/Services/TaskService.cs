// @branch feature/task-notifications
// @history 2026-07-13 — Emit assignment and status notifications from TaskService
// @branch feature/stretch-filters-pagination
// @history 2026-07-09 — Log Created, Updated, and StatusChanged events in TaskService
// @history 2026-07-09 — Priority/category filters and paginated task list

using AiLearningDashboard.Api.DTOs;
using AiLearningDashboard.Api.Entities;
using AiLearningDashboard.Api.Repositories;
using TaskStatus = AiLearningDashboard.Api.Entities.TaskStatus;

namespace AiLearningDashboard.Api.Services;

public interface ITaskService
{
    Task<List<TaskDto>> GetAllAsync(TaskQueryDto query, int? ownerIdFilter = null, CancellationToken cancellationToken = default);
    Task<PagedResultDto<TaskDto>> GetPagedAsync(TaskQueryDto query, int? ownerIdFilter = null, CancellationToken cancellationToken = default);
    Task<TaskDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<(TaskDto? Task, string? Error)> CreateAsync(CreateTaskDto dto, CancellationToken cancellationToken = default);
    Task<(TaskDto? Task, string? Error)> UpdateAsync(int id, UpdateTaskDto dto, CancellationToken cancellationToken = default);
    Task<(TaskDto? Task, string? Error)> UpdateStatusAsync(int id, string status, string? actorName = null, CancellationToken cancellationToken = default);
}

public class TaskService(
    ITaskRepository taskRepository,
    IActivityLogService activityLogService,
    INotificationService notificationService) : ITaskService
{
    public async Task<List<TaskDto>> GetAllAsync(TaskQueryDto query, int? ownerIdFilter = null, CancellationToken cancellationToken = default)
    {
        var listQuery = ParseQuery(query, ownerIdFilter);
        var tasks = await taskRepository.GetAllAsync(listQuery, cancellationToken);
        return tasks.Select(MapToDto).ToList();
    }

    public async Task<PagedResultDto<TaskDto>> GetPagedAsync(TaskQueryDto query, int? ownerIdFilter = null, CancellationToken cancellationToken = default)
    {
        var listQuery = ParseQuery(query, ownerIdFilter);
        listQuery.Page = Math.Max(1, query.Page ?? 1);
        listQuery.PageSize = Math.Clamp(
            query.PageSize ?? TaskRepository.DefaultPageSize,
            1,
            TaskRepository.MaxPageSize);

        var (items, totalCount) = await taskRepository.GetPagedAsync(listQuery, cancellationToken);
        var pageSize = listQuery.PageSize!.Value;
        var page = listQuery.Page!.Value;
        var totalPages = totalCount == 0 ? 0 : (int)Math.Ceiling(totalCount / (double)pageSize);

        return new PagedResultDto<TaskDto>
        {
            Items = items.Select(MapToDto).ToList(),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = totalPages
        };
    }

    private static TaskListQuery ParseQuery(TaskQueryDto query, int? ownerIdFilter = null)
    {
        var listQuery = new TaskListQuery
        {
            Search = query.Search,
            OwnerId = ownerIdFilter
        };

        if (!string.IsNullOrWhiteSpace(query.Status) &&
            Enum.TryParse<TaskStatus>(query.Status, true, out var status))
        {
            listQuery.Status = status;
        }

        if (!string.IsNullOrWhiteSpace(query.Priority) &&
            Enum.TryParse<TaskPriority>(query.Priority, true, out var priority))
        {
            listQuery.Priority = priority;
        }

        if (!string.IsNullOrWhiteSpace(query.Category) &&
            Enum.TryParse<TaskCategory>(query.Category, true, out var category))
        {
            listQuery.Category = category;
        }

        return listQuery;
    }

    public async Task<TaskDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var task = await taskRepository.GetByIdAsync(id, cancellationToken);
        return task is null ? null : MapToDto(task);
    }

    public async Task<(TaskDto? Task, string? Error)> CreateAsync(CreateTaskDto dto, CancellationToken cancellationToken = default)
    {
        if (!await taskRepository.UserExistsAsync(dto.OwnerId, cancellationToken))
        {
            return (null, "Owner does not exist.");
        }

        var now = DateTime.UtcNow;
        var task = new ProjectTask
        {
            Title = dto.Title.Trim(),
            Description = dto.Description?.Trim() ?? string.Empty,
            Category = Enum.Parse<TaskCategory>(dto.Category, true),
            Priority = Enum.Parse<TaskPriority>(dto.Priority, true),
            Status = Enum.Parse<TaskStatus>(dto.Status, true),
            OwnerId = dto.OwnerId,
            DueDate = DateTime.SpecifyKind(dto.DueDate.Date, DateTimeKind.Utc),
            CreatedAt = now,
            UpdatedAt = now
        };

        var created = await taskRepository.AddAsync(task, cancellationToken);
        var withOwner = await taskRepository.GetByIdAsync(created.Id, cancellationToken);
        if (withOwner is null)
        {
            return (null, null);
        }

        await activityLogService.LogAsync(
            withOwner.Id,
            "Created",
            previousValue: null,
            newValue: withOwner.Title,
            user: withOwner.Owner?.Name ?? "System",
            cancellationToken);

        await notificationService.NotifyTaskAssignedAsync(withOwner.OwnerId, withOwner.Id, cancellationToken);

        return (MapToDto(withOwner), null);
    }

    public async Task<(TaskDto? Task, string? Error)> UpdateAsync(int id, UpdateTaskDto dto, CancellationToken cancellationToken = default)
    {
        var existing = await taskRepository.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return (null, "Task not found.");
        }

        if (!await taskRepository.UserExistsAsync(dto.OwnerId, cancellationToken))
        {
            return (null, "Owner does not exist.");
        }

        var actor = existing.Owner?.Name ?? "System";
        var snapshots = CaptureSnapshot(existing);
        var previousOwnerId = existing.OwnerId;
        var previousStatus = existing.Status;

        existing.Title = dto.Title.Trim();
        existing.Description = dto.Description?.Trim() ?? string.Empty;
        existing.Category = Enum.Parse<TaskCategory>(dto.Category, true);
        existing.Priority = Enum.Parse<TaskPriority>(dto.Priority, true);
        existing.Status = Enum.Parse<TaskStatus>(dto.Status, true);
        existing.OwnerId = dto.OwnerId;
        existing.DueDate = DateTime.SpecifyKind(dto.DueDate.Date, DateTimeKind.Utc);
        existing.UpdatedAt = DateTime.UtcNow;

        await taskRepository.UpdateAsync(existing, cancellationToken);
        await LogFieldChangesAsync(id, snapshots, existing, actor, cancellationToken);

        var updated = await taskRepository.GetByIdAsync(id, cancellationToken);
        if (updated is null)
        {
            return (null, null);
        }

        if (previousOwnerId != updated.OwnerId)
        {
            await notificationService.NotifyTaskAssignedAsync(updated.OwnerId, updated.Id, cancellationToken);
        }

        await NotifyStatusChangeIfNeededAsync(
            previousStatus,
            updated.Status,
            actor,
            updated.Title,
            updated.Id,
            cancellationToken);

        return (MapToDto(updated), null);
    }

    public async Task<(TaskDto? Task, string? Error)> UpdateStatusAsync(int id, string status, string? actorName = null, CancellationToken cancellationToken = default)
    {
        var existing = await taskRepository.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return (null, "Task not found.");
        }

        var previousStatus = existing.Status;
        var previousStatusName = previousStatus.ToString();
        var newStatus = Enum.Parse<TaskStatus>(status, true);
        var newStatusName = newStatus.ToString();
        if (previousStatusName == newStatusName)
        {
            return (MapToDto(existing), null);
        }

        existing.Status = newStatus;
        existing.UpdatedAt = DateTime.UtcNow;

        await taskRepository.UpdateAsync(existing, cancellationToken);

        var actor = actorName ?? existing.Owner?.Name ?? "System";
        await activityLogService.LogAsync(
            id,
            "StatusChanged",
            previousValue: previousStatusName,
            newValue: newStatusName,
            user: actor,
            cancellationToken);

        var updated = await taskRepository.GetByIdAsync(id, cancellationToken);
        if (updated is null)
        {
            return (null, null);
        }

        await NotifyStatusChangeIfNeededAsync(
            previousStatus,
            updated.Status,
            actor,
            updated.Title,
            updated.Id,
            cancellationToken);

        return (MapToDto(updated), null);
    }

    private async Task NotifyStatusChangeIfNeededAsync(
        TaskStatus previousStatus,
        TaskStatus newStatus,
        string actorName,
        string taskTitle,
        int taskId,
        CancellationToken cancellationToken)
    {
        if (previousStatus == newStatus)
        {
            return;
        }

        if (newStatus == TaskStatus.InProgress)
        {
            await notificationService.NotifyTaskStartedAsync(actorName, taskTitle, taskId, cancellationToken);
        }
        else if (newStatus == TaskStatus.Completed)
        {
            await notificationService.NotifyTaskCompletedAsync(actorName, taskTitle, taskId, cancellationToken);
        }
    }

    private async Task LogFieldChangesAsync(
        int taskId,
        TaskSnapshot before,
        ProjectTask after,
        string actor,
        CancellationToken cancellationToken)
    {
        if (before.Title != after.Title)
        {
            await activityLogService.LogAsync(taskId, "Updated", $"Title: {before.Title}", $"Title: {after.Title}", actor, cancellationToken);
        }

        if (before.Description != after.Description)
        {
            await activityLogService.LogAsync(taskId, "Updated", $"Description: {before.Description}", $"Description: {after.Description}", actor, cancellationToken);
        }

        if (before.Category != after.Category.ToString())
        {
            await activityLogService.LogAsync(taskId, "Updated", $"Category: {before.Category}", $"Category: {after.Category}", actor, cancellationToken);
        }

        if (before.Priority != after.Priority.ToString())
        {
            await activityLogService.LogAsync(taskId, "Updated", $"Priority: {before.Priority}", $"Priority: {after.Priority}", actor, cancellationToken);
        }

        if (before.Status != after.Status.ToString())
        {
            await activityLogService.LogAsync(taskId, "StatusChanged", before.Status, after.Status.ToString(), actor, cancellationToken);
        }

        if (before.OwnerId != after.OwnerId)
        {
            await activityLogService.LogAsync(taskId, "Updated", $"OwnerId: {before.OwnerId}", $"OwnerId: {after.OwnerId}", actor, cancellationToken);
        }

        if (before.DueDate != after.DueDate.Date)
        {
            await activityLogService.LogAsync(
                taskId,
                "Updated",
                $"DueDate: {before.DueDate:yyyy-MM-dd}",
                $"DueDate: {after.DueDate:yyyy-MM-dd}",
                actor,
                cancellationToken);
        }
    }

    private static TaskSnapshot CaptureSnapshot(ProjectTask task) => new(
        task.Title,
        task.Description,
        task.Category.ToString(),
        task.Priority.ToString(),
        task.Status.ToString(),
        task.OwnerId,
        task.DueDate.Date);

    private static TaskDto MapToDto(ProjectTask task)
    {
        var today = DateTime.UtcNow.Date;
        return new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Category = task.Category.ToString(),
            Priority = task.Priority.ToString(),
            Status = task.Status.ToString(),
            OwnerId = task.OwnerId,
            OwnerName = task.Owner?.Name ?? string.Empty,
            DueDate = task.DueDate,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt,
            IsOverdue = task.DueDate.Date < today && task.Status != TaskStatus.Completed
        };
    }

    private sealed record TaskSnapshot(
        string Title,
        string Description,
        string Category,
        string Priority,
        string Status,
        int OwnerId,
        DateTime DueDate);
}

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetSummaryAsync(CancellationToken cancellationToken = default);
}

public class DashboardService(IDashboardRepository dashboardRepository) : IDashboardService
{
    public Task<DashboardSummaryDto> GetSummaryAsync(CancellationToken cancellationToken = default) =>
        dashboardRepository.GetSummaryAsync(cancellationToken);
}

public interface IUserService
{
    Task<List<UserDto>> GetAllAsync(CancellationToken cancellationToken = default);
}

public class UserService(IUserRepository userRepository) : IUserService
{
    public Task<List<UserDto>> GetAllAsync(CancellationToken cancellationToken = default) =>
        userRepository.GetAllAsync(cancellationToken);
}
