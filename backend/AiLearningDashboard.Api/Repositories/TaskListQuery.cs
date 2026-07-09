// @branch feature/stretch-filters-pagination
using AiLearningDashboard.Api.Entities;
using TaskStatus = AiLearningDashboard.Api.Entities.TaskStatus;

namespace AiLearningDashboard.Api.Repositories;

public class TaskListQuery
{
    public string? Search { get; set; }
    public TaskStatus? Status { get; set; }
    public TaskPriority? Priority { get; set; }
    public TaskCategory? Category { get; set; }
    public int? Page { get; set; }
    public int? PageSize { get; set; }
}
