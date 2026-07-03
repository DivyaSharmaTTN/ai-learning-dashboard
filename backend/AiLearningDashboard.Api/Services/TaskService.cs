using AiLearningDashboard.Api.DTOs;
using AiLearningDashboard.Api.Entities;
using AiLearningDashboard.Api.Repositories;
using TaskStatus = AiLearningDashboard.Api.Entities.TaskStatus;

namespace AiLearningDashboard.Api.Services;

public interface ITaskService
{
    Task<List<TaskDto>> GetAllAsync(string? search, string? status, CancellationToken cancellationToken = default);
    Task<TaskDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<(TaskDto? Task, string? Error)> CreateAsync(CreateTaskDto dto, CancellationToken cancellationToken = default);
    Task<(TaskDto? Task, string? Error)> UpdateAsync(int id, UpdateTaskDto dto, CancellationToken cancellationToken = default);
    Task<(TaskDto? Task, string? Error)> UpdateStatusAsync(int id, string status, CancellationToken cancellationToken = default);
}

public class TaskService(ITaskRepository taskRepository) : ITaskService
{
    public async Task<List<TaskDto>> GetAllAsync(string? search, string? status, CancellationToken cancellationToken = default)
    {
        TaskStatus? statusFilter = null;
        if (!string.IsNullOrWhiteSpace(status))
        {
            if (!Enum.TryParse<TaskStatus>(status, true, out var parsed))
            {
                return [];
            }

            statusFilter = parsed;
        }

        var tasks = await taskRepository.GetAllAsync(search, statusFilter, cancellationToken);
        return tasks.Select(MapToDto).ToList();
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
        return (withOwner is null ? null : MapToDto(withOwner), null);
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

        existing.Title = dto.Title.Trim();
        existing.Description = dto.Description?.Trim() ?? string.Empty;
        existing.Category = Enum.Parse<TaskCategory>(dto.Category, true);
        existing.Priority = Enum.Parse<TaskPriority>(dto.Priority, true);
        existing.Status = Enum.Parse<TaskStatus>(dto.Status, true);
        existing.OwnerId = dto.OwnerId;
        existing.DueDate = DateTime.SpecifyKind(dto.DueDate.Date, DateTimeKind.Utc);
        existing.UpdatedAt = DateTime.UtcNow;

        await taskRepository.UpdateAsync(existing, cancellationToken);
        var updated = await taskRepository.GetByIdAsync(id, cancellationToken);
        return (updated is null ? null : MapToDto(updated), null);
    }

    public async Task<(TaskDto? Task, string? Error)> UpdateStatusAsync(int id, string status, CancellationToken cancellationToken = default)
    {
        var existing = await taskRepository.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return (null, "Task not found.");
        }

        existing.Status = Enum.Parse<TaskStatus>(status, true);
        existing.UpdatedAt = DateTime.UtcNow;

        await taskRepository.UpdateAsync(existing, cancellationToken);
        var updated = await taskRepository.GetByIdAsync(id, cancellationToken);
        return (updated is null ? null : MapToDto(updated), null);
    }

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
