// @branch feature/stretch-activity-log
// @history 2026-07-09 — ActivityLog entity for persisted audit trail

namespace AiLearningDashboard.Api.Entities;

public class ActivityLog
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string? PreviousValue { get; set; }
    public string? NewValue { get; set; }
    public string User { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }

    public ProjectTask? Task { get; set; }
}
