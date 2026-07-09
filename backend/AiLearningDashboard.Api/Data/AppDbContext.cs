// @branch feature/stretch-activity-log
// @history 2026-07-09 — ActivityLogs DbSet and entity configuration

using AiLearningDashboard.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace AiLearningDashboard.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<ProjectTask> ProjectTasks => Set<ProjectTask>();
    public DbSet<ActivityLog> ActivityLogs => Set<ActivityLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Name).IsRequired().HasMaxLength(100);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(200);
            entity.Property(u => u.Role).IsRequired().HasMaxLength(50);
        });

        modelBuilder.Entity<ProjectTask>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Title).IsRequired().HasMaxLength(200);
            entity.Property(t => t.Description).HasMaxLength(2000);
            entity.Property(t => t.Category).HasConversion<string>().HasMaxLength(50);
            entity.Property(t => t.Priority).HasConversion<string>().HasMaxLength(20);
            entity.Property(t => t.Status).HasConversion<string>().HasMaxLength(20);

            entity.HasOne(t => t.Owner)
                .WithMany(u => u.Tasks)
                .HasForeignKey(t => t.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ActivityLog>(entity =>
        {
            entity.HasKey(l => l.Id);
            entity.Property(l => l.Action).IsRequired().HasMaxLength(50);
            entity.Property(l => l.PreviousValue).HasMaxLength(500);
            entity.Property(l => l.NewValue).HasMaxLength(500);
            entity.Property(l => l.User).IsRequired().HasMaxLength(100);

            entity.HasOne(l => l.Task)
                .WithMany()
                .HasForeignKey(l => l.TaskId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(l => l.TaskId);
        });

        SeedUsers(modelBuilder);
    }

    private static void SeedUsers(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, Name = "Alex Developer", Email = "alex@example.com", Role = "Developer" },
            new User { Id = 2, Name = "Sam Learner", Email = "sam@example.com", Role = "Learner" },
            new User { Id = 3, Name = "Jordan Lead", Email = "jordan@example.com", Role = "Lead" }
        );
    }
}
