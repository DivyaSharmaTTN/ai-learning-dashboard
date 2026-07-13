// @branch feature/task-notifications
// @history 2026-07-13 — DTOs for notification list and unread count

namespace AiLearningDashboard.Api.DTOs;

public class NotificationDto
{
    public int Id { get; set; }
    public int RecipientUserId { get; set; }
    public int TaskId { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class UnreadCountDto
{
    public int Count { get; set; }
}
