namespace AiLearningDashboard.Api.Entities;

public class ProjectTask
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TaskCategory Category { get; set; }
    public TaskPriority Priority { get; set; }
    public TaskStatus Status { get; set; }
    public int OwnerId { get; set; }
    public User Owner { get; set; } = null!;
    public DateTime DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
