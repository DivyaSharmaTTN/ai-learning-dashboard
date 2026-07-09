using AiLearningDashboard.Api.Data;
using AiLearningDashboard.Api.DTOs;
using AiLearningDashboard.Api.Entities;
using Microsoft.EntityFrameworkCore;
using TaskStatus = AiLearningDashboard.Api.Entities.TaskStatus;

namespace AiLearningDashboard.Api.Repositories;

public interface IUserRepository
{
    Task<List<UserDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
}

public class UserRepository(AppDbContext dbContext) : IUserRepository
{
    public async Task<List<UserDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.Users
            .OrderBy(u => u.Name)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await dbContext.Users
            .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
    }
}

public interface IDashboardRepository
{
    Task<DashboardSummaryDto> GetSummaryAsync(CancellationToken cancellationToken = default);
}

public class DashboardRepository(AppDbContext dbContext) : IDashboardRepository
{
    public async Task<DashboardSummaryDto> GetSummaryAsync(CancellationToken cancellationToken = default)
    {
        var today = DateTime.UtcNow.Date;
        var tasks = dbContext.ProjectTasks.AsNoTracking();

        var total = await tasks.CountAsync(cancellationToken);
        var completed = await tasks.CountAsync(t => t.Status == TaskStatus.Completed, cancellationToken);
        var inProgress = await tasks.CountAsync(t => t.Status == TaskStatus.InProgress, cancellationToken);
        var overdue = await tasks.CountAsync(
            t => t.DueDate.Date < today && t.Status != TaskStatus.Completed,
            cancellationToken);
        var highPriority = await tasks.CountAsync(
            t => t.Priority == Entities.TaskPriority.High,
            cancellationToken);

        return new DashboardSummaryDto
        {
            TotalItems = total,
            CompletedItems = completed,
            InProgressItems = inProgress,
            OverdueItems = overdue,
            HighPriorityItems = highPriority
        };
    }
}
