// @branch feature/task-notifications
// @history 2026-07-13 — Create and manage in-app notifications

using AiLearningDashboard.Api.DTOs;
using AiLearningDashboard.Api.Entities;
using AiLearningDashboard.Api.Repositories;

namespace AiLearningDashboard.Api.Services;

public interface INotificationService
{
    Task NotifyTaskAssignedAsync(int recipientUserId, int taskId, CancellationToken cancellationToken = default);
    Task NotifyTaskStartedAsync(string userName, string taskTitle, int taskId, CancellationToken cancellationToken = default);
    Task NotifyTaskCompletedAsync(string userName, string taskTitle, int taskId, CancellationToken cancellationToken = default);
    Task<List<NotificationDto>> GetForUserAsync(int recipientUserId, bool unreadOnly = false, CancellationToken cancellationToken = default);
    Task<int> GetUnreadCountAsync(int recipientUserId, CancellationToken cancellationToken = default);
    Task<(bool Success, string? Error)> MarkAsReadAsync(int notificationId, int recipientUserId, CancellationToken cancellationToken = default);
    Task MarkAllAsReadAsync(int recipientUserId, CancellationToken cancellationToken = default);
}

public class NotificationService(INotificationRepository notificationRepository) : INotificationService
{
    public async Task NotifyTaskAssignedAsync(int recipientUserId, int taskId, CancellationToken cancellationToken = default)
    {
        await notificationRepository.AddAsync(new Notification
        {
            RecipientUserId = recipientUserId,
            TaskId = taskId,
            Message = "A new task has been assigned to you.",
            Type = NotificationTypes.TaskAssigned,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        }, cancellationToken);
    }

    public async Task NotifyTaskStartedAsync(
        string userName,
        string taskTitle,
        int taskId,
        CancellationToken cancellationToken = default)
    {
        await NotifyAdminsAsync(
            $"{userName} started {taskTitle}.",
            NotificationTypes.TaskStarted,
            taskId,
            cancellationToken);
    }

    public async Task NotifyTaskCompletedAsync(
        string userName,
        string taskTitle,
        int taskId,
        CancellationToken cancellationToken = default)
    {
        await NotifyAdminsAsync(
            $"{userName} completed {taskTitle}.",
            NotificationTypes.TaskCompleted,
            taskId,
            cancellationToken);
    }

    public async Task<List<NotificationDto>> GetForUserAsync(
        int recipientUserId,
        bool unreadOnly = false,
        CancellationToken cancellationToken = default)
    {
        var items = await notificationRepository.GetByRecipientAsync(recipientUserId, unreadOnly, cancellationToken);
        return items.Select(MapToDto).ToList();
    }

    public Task<int> GetUnreadCountAsync(int recipientUserId, CancellationToken cancellationToken = default) =>
        notificationRepository.GetUnreadCountAsync(recipientUserId, cancellationToken);

    public async Task<(bool Success, string? Error)> MarkAsReadAsync(
        int notificationId,
        int recipientUserId,
        CancellationToken cancellationToken = default)
    {
        var notification = await notificationRepository.GetByIdAsync(notificationId, cancellationToken);
        if (notification is null)
        {
            return (false, "Notification not found.");
        }

        if (notification.RecipientUserId != recipientUserId)
        {
            return (false, "Forbidden.");
        }

        if (!notification.IsRead)
        {
            notification.IsRead = true;
            await notificationRepository.UpdateAsync(notification, cancellationToken);
        }

        return (true, null);
    }

    public Task MarkAllAsReadAsync(int recipientUserId, CancellationToken cancellationToken = default) =>
        notificationRepository.MarkAllReadAsync(recipientUserId, cancellationToken);

    private async Task NotifyAdminsAsync(
        string message,
        string type,
        int taskId,
        CancellationToken cancellationToken)
    {
        var adminIds = await notificationRepository.GetAdminUserIdsAsync(cancellationToken);
        if (adminIds.Count == 0)
        {
            return;
        }

        var now = DateTime.UtcNow;
        var notifications = adminIds.Select(adminId => new Notification
        {
            RecipientUserId = adminId,
            TaskId = taskId,
            Message = message,
            Type = type,
            IsRead = false,
            CreatedAt = now
        });

        await notificationRepository.AddRangeAsync(notifications, cancellationToken);
    }

    private static NotificationDto MapToDto(Notification notification) => new()
    {
        Id = notification.Id,
        RecipientUserId = notification.RecipientUserId,
        TaskId = notification.TaskId,
        Message = notification.Message,
        Type = notification.Type,
        IsRead = notification.IsRead,
        CreatedAt = notification.CreatedAt
    };
}
