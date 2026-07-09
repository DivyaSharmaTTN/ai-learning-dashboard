// @branch feature/stretch-filters-pagination
// @history 2026-07-09 — ActivityLogDto for audit history API responses
// @history 2026-07-09 — TaskQueryDto filters + PagedResultDto for paginated list

using System.Text.Json.Serialization;
using AiLearningDashboard.Api.Entities;

namespace AiLearningDashboard.Api.DTOs;

public class UserDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

public class TaskDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int OwnerId { get; set; }
    public string OwnerName { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsOverdue { get; set; }
}

public class CreateTaskDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int OwnerId { get; set; }
    public DateTime DueDate { get; set; }
}

public class UpdateTaskDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int OwnerId { get; set; }
    public DateTime DueDate { get; set; }
}

public class UpdateTaskStatusDto
{
    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;
}

public class DashboardSummaryDto
{
    public int TotalItems { get; set; }
    public int CompletedItems { get; set; }
    public int InProgressItems { get; set; }
    public int OverdueItems { get; set; }
    public int HighPriorityItems { get; set; }
}

public class TaskQueryDto
{
    public string? Search { get; set; }
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public string? Category { get; set; }
    public int? Page { get; set; }
    public int? PageSize { get; set; }
}

public class PagedResultDto<T>
{
    public List<T> Items { get; set; } = [];
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

public class ActivityLogDto
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string? PreviousValue { get; set; }
    public string? NewValue { get; set; }
    public string User { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}
