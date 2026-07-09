// @branch feature/stretch-filters-pagination
// @history 2026-07-09 — Priority/category filters and optional pagination

using AiLearningDashboard.Api.Data;
using AiLearningDashboard.Api.Entities;
using Microsoft.EntityFrameworkCore;
using TaskStatus = AiLearningDashboard.Api.Entities.TaskStatus;

namespace AiLearningDashboard.Api.Repositories;

public interface ITaskRepository
{
    Task<List<ProjectTask>> GetAllAsync(TaskListQuery query, CancellationToken cancellationToken = default);
    Task<(List<ProjectTask> Items, int TotalCount)> GetPagedAsync(TaskListQuery query, CancellationToken cancellationToken = default);
    Task<ProjectTask?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<ProjectTask> AddAsync(ProjectTask task, CancellationToken cancellationToken = default);
    Task<ProjectTask?> UpdateAsync(ProjectTask task, CancellationToken cancellationToken = default);
    Task<bool> UserExistsAsync(int userId, CancellationToken cancellationToken = default);
}

public class TaskRepository(AppDbContext dbContext) : ITaskRepository
{
    public const int DefaultPageSize = 10;
    public const int MaxPageSize = 100;

    public async Task<List<ProjectTask>> GetAllAsync(TaskListQuery query, CancellationToken cancellationToken = default)
    {
        return await ApplyFilters(query)
            .OrderByDescending(t => t.UpdatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<(List<ProjectTask> Items, int TotalCount)> GetPagedAsync(
        TaskListQuery query,
        CancellationToken cancellationToken = default)
    {
        var filtered = ApplyFilters(query);
        var totalCount = await filtered.CountAsync(cancellationToken);

        var page = Math.Max(1, query.Page ?? 1);
        var pageSize = Math.Clamp(query.PageSize ?? DefaultPageSize, 1, MaxPageSize);
        var skip = (page - 1) * pageSize;

        var items = await filtered
            .OrderByDescending(t => t.UpdatedAt)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<ProjectTask?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await dbContext.ProjectTasks
            .Include(t => t.Owner)
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
    }

    public async Task<ProjectTask> AddAsync(ProjectTask task, CancellationToken cancellationToken = default)
    {
        dbContext.ProjectTasks.Add(task);
        await dbContext.SaveChangesAsync(cancellationToken);
        return task;
    }

    public async Task<ProjectTask?> UpdateAsync(ProjectTask task, CancellationToken cancellationToken = default)
    {
        dbContext.ProjectTasks.Update(task);
        await dbContext.SaveChangesAsync(cancellationToken);
        return task;
    }

    public async Task<bool> UserExistsAsync(int userId, CancellationToken cancellationToken = default)
    {
        return await dbContext.Users.AnyAsync(u => u.Id == userId, cancellationToken);
    }

    private IQueryable<ProjectTask> ApplyFilters(TaskListQuery query)
    {
        var dbQuery = dbContext.ProjectTasks
            .Include(t => t.Owner)
            .AsQueryable();

        if (query.Status.HasValue)
        {
            dbQuery = dbQuery.Where(t => t.Status == query.Status.Value);
        }

        if (query.Priority.HasValue)
        {
            dbQuery = dbQuery.Where(t => t.Priority == query.Priority.Value);
        }

        if (query.Category.HasValue)
        {
            dbQuery = dbQuery.Where(t => t.Category == query.Category.Value);
        }

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var term = query.Search.Trim().ToLower();
            dbQuery = dbQuery.Where(t =>
                t.Title.ToLower().Contains(term) ||
                t.Description.ToLower().Contains(term));
        }

        if (query.OwnerId.HasValue)
        {
            dbQuery = dbQuery.Where(t => t.OwnerId == query.OwnerId.Value);
        }

        return dbQuery;
    }
}
