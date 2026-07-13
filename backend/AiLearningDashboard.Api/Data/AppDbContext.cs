// @branch feature/task-notifications
// @history 2026-07-13 — Notifications DbSet and relationships
// @branch feature/stretch-auth-rbac
// @history 2026-07-09 — JWT authentication, auth users seed, PasswordHash column

using AiLearningDashboard.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace AiLearningDashboard.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<ProjectTask> ProjectTasks => Set<ProjectTask>();
    public DbSet<ActivityLog> ActivityLogs => Set<ActivityLog>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Name).IsRequired().HasMaxLength(100);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(200);
            entity.Property(u => u.Role).IsRequired().HasMaxLength(50);
            entity.Property(u => u.PasswordHash).HasMaxLength(200);
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

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(n => n.Id);
            entity.Property(n => n.Message).IsRequired().HasMaxLength(500);
            entity.Property(n => n.Type).IsRequired().HasMaxLength(50);

            entity.HasOne(n => n.Recipient)
                .WithMany()
                .HasForeignKey(n => n.RecipientUserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(n => n.Task)
                .WithMany()
                .HasForeignKey(n => n.TaskId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(n => n.RecipientUserId);
            entity.HasIndex(n => new { n.RecipientUserId, n.IsRead });
        });

        SeedUsers(modelBuilder);
    }

    private static void SeedUsers(ModelBuilder modelBuilder)
    {
        const string adminHash = "$2a$11$gsfid97c/CljebQP2Z5lTeiVFSOZknEphwqEPexaeneC7qi2FiKTq";
        const string userHash = "$2a$11$CMgFLHIxu35vejD7B29V8ugr0877Jqrx.DtdGZIkVzZDyIuKJRy9e";

        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, Name = "Alex Developer", Email = "alex@example.com", Role = "Developer" },
            new User { Id = 2, Name = "Sam Learner", Email = "sam@example.com", Role = "Learner" },
            new User { Id = 3, Name = "Jordan Lead", Email = "jordan@example.com", Role = "Lead" },
            new User
            {
                Id = 4,
                Name = "Admin",
                Email = "admin@example.com",
                Role = AuthRoles.Admin,
                PasswordHash = adminHash
            },
            new User
            {
                Id = 5,
                Name = "User",
                Email = "user@example.com",
                Role = AuthRoles.User,
                PasswordHash = userHash
            }
        );
    }
}
