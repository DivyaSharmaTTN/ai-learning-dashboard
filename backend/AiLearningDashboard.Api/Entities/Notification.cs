// @branch feature/task-notifications
// @history 2026-07-13 — Notification entity for in-app inbox

namespace AiLearningDashboard.Api.Entities;

public class Notification
{
    public int Id { get; set; }
    public int RecipientUserId { get; set; }
    public int TaskId { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }

    public User Recipient { get; set; } = null!;
    public ProjectTask Task { get; set; } = null!;
}

public static class NotificationTypes
{
    public const string TaskAssigned = "TaskAssigned";
    public const string TaskStarted = "TaskStarted";
    public const string TaskCompleted = "TaskCompleted";
}
