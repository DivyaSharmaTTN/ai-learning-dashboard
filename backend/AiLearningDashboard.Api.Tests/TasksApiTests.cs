using System.Net;
using System.Net.Http.Json;
using AiLearningDashboard.Api.Data;
using AiLearningDashboard.Api.DTOs;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace AiLearningDashboard.Api.Tests;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _dbName = $"TestDb_{Guid.NewGuid()}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));

            if (descriptor is not null)
            {
                services.Remove(descriptor);
            }

            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlite($"Data Source={_dbName}.db"));
        });
    }
}

public class TasksApiTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public TasksApiTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CreateTask_WithValidData_ReturnsCreated()
    {
        var dto = new CreateTaskDto
        {
            Title = "Learn EF Core",
            Description = "Migrations chapter",
            Category = "Learning",
            Priority = "High",
            Status = "NotStarted",
            OwnerId = 1,
            DueDate = DateTime.UtcNow.AddDays(7)
        };

        var response = await _client.PostAsJsonAsync("/api/tasks", dto);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var task = await response.Content.ReadFromJsonAsync<TaskDto>();
        Assert.NotNull(task);
        Assert.Equal("Learn EF Core", task.Title);
    }

    [Fact]
    public async Task CreateTask_WithEmptyTitle_ReturnsBadRequest()
    {
        var dto = new CreateTaskDto
        {
            Title = "",
            Category = "Learning",
            Priority = "Medium",
            Status = "NotStarted",
            OwnerId = 1,
            DueDate = DateTime.UtcNow.AddDays(3)
        };

        var response = await _client.PostAsJsonAsync("/api/tasks", dto);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetTasks_AfterCreate_ReturnsTaskInList()
    {
        var dto = new CreateTaskDto
        {
            Title = "Integration Test Task",
            Category = "Project",
            Priority = "Low",
            Status = "NotStarted",
            OwnerId = 2,
            DueDate = DateTime.UtcNow.AddDays(5)
        };

        await _client.PostAsJsonAsync("/api/tasks", dto);

        var tasks = await _client.GetFromJsonAsync<List<TaskDto>>("/api/tasks");

        Assert.NotNull(tasks);
        Assert.Contains(tasks, t => t.Title == "Integration Test Task");
    }

    [Fact]
    public async Task UpdateTaskStatus_ToInProgress_ReturnsUpdatedStatus()
    {
        var createResponse = await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Status Update Task",
            Category = "Learning",
            Priority = "Medium",
            Status = "NotStarted",
            OwnerId = 1,
            DueDate = DateTime.UtcNow.AddDays(2)
        });

        var created = await createResponse.Content.ReadFromJsonAsync<TaskDto>();
        Assert.NotNull(created);

        var patchResponse = await _client.PatchAsJsonAsync(
            $"/api/tasks/{created.Id}/status",
            new UpdateTaskStatusDto { Status = "InProgress" });

        Assert.Equal(HttpStatusCode.OK, patchResponse.StatusCode);
        var updated = await patchResponse.Content.ReadFromJsonAsync<TaskDto>();
        Assert.Equal("InProgress", updated?.Status);
    }

    [Fact]
    public async Task DashboardSummary_UpdatesAfterCreate()
    {
        var before = await _client.GetFromJsonAsync<DashboardSummaryDto>("/api/dashboard/summary");
        Assert.NotNull(before);

        await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Dashboard Count Task",
            Category = "Project",
            Priority = "High",
            Status = "InProgress",
            OwnerId = 1,
            DueDate = DateTime.UtcNow.AddDays(10)
        });

        var after = await _client.GetFromJsonAsync<DashboardSummaryDto>("/api/dashboard/summary");
        Assert.NotNull(after);
        Assert.Equal(before.TotalItems + 1, after.TotalItems);
        Assert.Equal(before.InProgressItems + 1, after.InProgressItems);
        Assert.Equal(before.HighPriorityItems + 1, after.HighPriorityItems);
    }

    [Fact]
    public async Task DashboardSummary_OverdueExcludesCompleted()
    {
        await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Overdue Completed",
            Category = "Learning",
            Priority = "Low",
            Status = "Completed",
            OwnerId = 1,
            DueDate = DateTime.UtcNow.AddDays(-5)
        });

        await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Overdue Active",
            Category = "Learning",
            Priority = "Low",
            Status = "InProgress",
            OwnerId = 1,
            DueDate = DateTime.UtcNow.AddDays(-3)
        });

        var summary = await _client.GetFromJsonAsync<DashboardSummaryDto>("/api/dashboard/summary");
        Assert.NotNull(summary);
        Assert.True(summary.OverdueItems >= 1);
    }
}
