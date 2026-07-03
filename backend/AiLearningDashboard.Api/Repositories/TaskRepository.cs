using AiLearningDashboard.Api.Data;
using AiLearningDashboard.Api.Entities;
using Microsoft.EntityFrameworkCore;
using TaskStatus = AiLearningDashboard.Api.Entities.TaskStatus;

namespace AiLearningDashboard.Api.Repositories;

public interface ITaskRepository
{
    Task<List<ProjectTask>> GetAllAsync(string? search, TaskStatus? status, CancellationToken cancellationToken = default);
    Task<ProjectTask?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<ProjectTask> AddAsync(ProjectTask task, CancellationToken cancellationToken = default);
    Task<ProjectTask?> UpdateAsync(ProjectTask task, CancellationToken cancellationToken = default);
    Task<bool> UserExistsAsync(int userId, CancellationToken cancellationToken = default);
}

public class TaskRepository(AppDbContext dbContext) : ITaskRepository
{
    public async Task<List<ProjectTask>> GetAllAsync(string? search, TaskStatus? status, CancellationToken cancellationToken = default)
    {
        var query = dbContext.ProjectTasks
            .Include(t => t.Owner)
            .AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(t => t.Status == status.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(t =>
                t.Title.ToLower().Contains(term) ||
                t.Description.ToLower().Contains(term));
        }

        return await query
            .OrderByDescending(t => t.UpdatedAt)
            .ToListAsync(cancellationToken);
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
}
