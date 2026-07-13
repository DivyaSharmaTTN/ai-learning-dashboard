// @branch feature/task-notifications
// @history 2026-07-13 — EF repository for notification inbox

using AiLearningDashboard.Api.Data;
using AiLearningDashboard.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace AiLearningDashboard.Api.Repositories;

public interface INotificationRepository
{
    Task AddAsync(Notification notification, CancellationToken cancellationToken = default);
    Task AddRangeAsync(IEnumerable<Notification> notifications, CancellationToken cancellationToken = default);
    Task<List<Notification>> GetByRecipientAsync(int recipientUserId, bool unreadOnly = false, CancellationToken cancellationToken = default);
    Task<Notification?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<int> GetUnreadCountAsync(int recipientUserId, CancellationToken cancellationToken = default);
    Task UpdateAsync(Notification notification, CancellationToken cancellationToken = default);
    Task MarkAllReadAsync(int recipientUserId, CancellationToken cancellationToken = default);
    Task<List<int>> GetAdminUserIdsAsync(CancellationToken cancellationToken = default);
}

public class NotificationRepository(AppDbContext dbContext) : INotificationRepository
{
    public async Task AddAsync(Notification notification, CancellationToken cancellationToken = default)
    {
        dbContext.Notifications.Add(notification);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task AddRangeAsync(IEnumerable<Notification> notifications, CancellationToken cancellationToken = default)
    {
        dbContext.Notifications.AddRange(notifications);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<Notification>> GetByRecipientAsync(
        int recipientUserId,
        bool unreadOnly = false,
        CancellationToken cancellationToken = default)
    {
        var query = dbContext.Notifications
            .AsNoTracking()
            .Where(n => n.RecipientUserId == recipientUserId);

        if (unreadOnly)
        {
            query = query.Where(n => !n.IsRead);
        }

        return await query
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Notification?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await dbContext.Notifications.FirstOrDefaultAsync(n => n.Id == id, cancellationToken);
    }

    public async Task<int> GetUnreadCountAsync(int recipientUserId, CancellationToken cancellationToken = default)
    {
        return await dbContext.Notifications
            .CountAsync(n => n.RecipientUserId == recipientUserId && !n.IsRead, cancellationToken);
    }

    public async Task UpdateAsync(Notification notification, CancellationToken cancellationToken = default)
    {
        dbContext.Notifications.Update(notification);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task MarkAllReadAsync(int recipientUserId, CancellationToken cancellationToken = default)
    {
        await dbContext.Notifications
            .Where(n => n.RecipientUserId == recipientUserId && !n.IsRead)
            .ExecuteUpdateAsync(s => s.SetProperty(n => n.IsRead, true), cancellationToken);
    }

    public async Task<List<int>> GetAdminUserIdsAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.Users
            .AsNoTracking()
            .Where(u => u.Role == AuthRoles.Admin)
            .Select(u => u.Id)
            .ToListAsync(cancellationToken);
    }
}
