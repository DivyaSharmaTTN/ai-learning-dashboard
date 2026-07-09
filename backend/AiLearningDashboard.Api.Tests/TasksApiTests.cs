// @branch feature/stretch-filters-pagination
// @history 2026-07-09 — Activity log integration tests (create, status change, 404)
// @history 2026-07-09 — Pagination and priority/category filter tests

using System.Net;
using System.Net.Http.Json;
using AiLearningDashboard.Api.DTOs;

namespace AiLearningDashboard.Api.Tests;

public class TasksApiTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public TasksApiTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    private async Task AuthenticateAsAdminAsync()
    {
        var token = await AuthTestHelper.LoginAsAdminAsync(_client);
        AuthTestHelper.SetBearerToken(_client, token);
    }

    [Fact]
    public async Task CreateTask_WithValidData_ReturnsCreated()
    {
        await AuthenticateAsAdminAsync();
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
        await AuthenticateAsAdminAsync();
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
        await AuthenticateAsAdminAsync();
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
        await AuthenticateAsAdminAsync();
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
        await AuthenticateAsAdminAsync();
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
    public async Task CreateTask_WithInvalidOwner_ReturnsBadRequest()
    {
        await AuthenticateAsAdminAsync();
        var dto = new CreateTaskDto
        {
            Title = "Invalid Owner Task",
            Category = "Learning",
            Priority = "Medium",
            Status = "NotStarted",
            OwnerId = 999,
            DueDate = DateTime.UtcNow.AddDays(3)
        };

        var response = await _client.PostAsJsonAsync("/api/tasks", dto);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetTasks_WithStatusFilter_ReturnsMatchingTasks()
    {
        await AuthenticateAsAdminAsync();
        await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Filter In Progress Task",
            Category = "Project",
            Priority = "Low",
            Status = "InProgress",
            OwnerId = 1,
            DueDate = DateTime.UtcNow.AddDays(5)
        });

        var tasks = await _client.GetFromJsonAsync<List<TaskDto>>("/api/tasks?status=InProgress");

        Assert.NotNull(tasks);
        Assert.Contains(tasks, t => t.Title == "Filter In Progress Task");
        Assert.All(tasks, t => Assert.Equal("InProgress", t.Status));
    }

    [Fact]
    public async Task DashboardSummary_OverdueExcludesCompleted()
    {
        await AuthenticateAsAdminAsync();
        var before = await _client.GetFromJsonAsync<DashboardSummaryDto>("/api/dashboard/summary");
        Assert.NotNull(before);

        await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Overdue Completed",
            Category = "Learning",
            Priority = "Low",
            Status = "Completed",
            OwnerId = 1,
            DueDate = DateTime.UtcNow.AddDays(-5)
        });

        var afterCompleted = await _client.GetFromJsonAsync<DashboardSummaryDto>("/api/dashboard/summary");
        Assert.NotNull(afterCompleted);
        Assert.Equal(before.OverdueItems, afterCompleted.OverdueItems);

        await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Overdue Active",
            Category = "Learning",
            Priority = "Low",
            Status = "InProgress",
            OwnerId = 1,
            DueDate = DateTime.UtcNow.AddDays(-3)
        });

        var afterActive = await _client.GetFromJsonAsync<DashboardSummaryDto>("/api/dashboard/summary");
        Assert.NotNull(afterActive);
        Assert.Equal(afterCompleted.OverdueItems + 1, afterActive.OverdueItems);
    }

    [Fact]
    public async Task CreateTask_CreatesActivityLogEntry()
    {
        await AuthenticateAsAdminAsync();
        var response = await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Activity Log Task",
            Category = "Learning",
            Priority = "Medium",
            Status = "NotStarted",
            OwnerId = 1,
            DueDate = DateTime.UtcNow.AddDays(4)
        });

        var created = await response.Content.ReadFromJsonAsync<TaskDto>();
        Assert.NotNull(created);

        var activity = await _client.GetFromJsonAsync<List<ActivityLogDto>>($"/api/tasks/{created.Id}/activity");
        Assert.NotNull(activity);
        Assert.Single(activity);
        Assert.Equal("Created", activity[0].Action);
        Assert.Equal("Activity Log Task", activity[0].NewValue);
        Assert.Equal("Alex Developer", activity[0].User);
    }

    [Fact]
    public async Task UpdateTaskStatus_CreatesStatusChangeActivityLog()
    {
        await AuthenticateAsAdminAsync();
        var createResponse = await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Status Activity Task",
            Category = "Project",
            Priority = "Low",
            Status = "NotStarted",
            OwnerId = 1,
            DueDate = DateTime.UtcNow.AddDays(2)
        });

        var created = await createResponse.Content.ReadFromJsonAsync<TaskDto>();
        Assert.NotNull(created);

        await _client.PatchAsJsonAsync(
            $"/api/tasks/{created.Id}/status",
            new UpdateTaskStatusDto { Status = "InProgress" });

        var activity = await _client.GetFromJsonAsync<List<ActivityLogDto>>($"/api/tasks/{created.Id}/activity");
        Assert.NotNull(activity);
        Assert.Contains(activity, a => a.Action == "StatusChanged" && a.PreviousValue == "NotStarted" && a.NewValue == "InProgress");
    }

    [Fact]
    public async Task GetTaskActivity_ForUnknownTask_ReturnsNotFound()
    {
        await AuthenticateAsAdminAsync();
        var response = await _client.GetAsync("/api/tasks/99999/activity");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetTasks_WithPriorityFilter_ReturnsMatchingTasks()
    {
        await AuthenticateAsAdminAsync();
        await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "High Priority Filter Task",
            Category = "Project",
            Priority = "High",
            Status = "NotStarted",
            OwnerId = 1,
            DueDate = DateTime.UtcNow.AddDays(5)
        });

        var tasks = await _client.GetFromJsonAsync<List<TaskDto>>("/api/tasks?priority=High");

        Assert.NotNull(tasks);
        Assert.Contains(tasks, t => t.Title == "High Priority Filter Task");
        Assert.All(tasks, t => Assert.Equal("High", t.Priority));
    }

    [Fact]
    public async Task GetTasks_WithCategoryFilter_ReturnsMatchingTasks()
    {
        await AuthenticateAsAdminAsync();
        await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Certification Filter Task",
            Category = "Certification",
            Priority = "Medium",
            Status = "NotStarted",
            OwnerId = 1,
            DueDate = DateTime.UtcNow.AddDays(5)
        });

        var tasks = await _client.GetFromJsonAsync<List<TaskDto>>("/api/tasks?category=Certification");

        Assert.NotNull(tasks);
        Assert.Contains(tasks, t => t.Title == "Certification Filter Task");
        Assert.All(tasks, t => Assert.Equal("Certification", t.Category));
    }

    [Fact]
    public async Task GetTasks_WithPagination_ReturnsPagedResult()
    {
        await AuthenticateAsAdminAsync();
        for (var i = 0; i < 12; i++)
        {
            await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
            {
                Title = $"Pagination Task {i + 1}",
                Category = "Learning",
                Priority = "Low",
                Status = "NotStarted",
                OwnerId = 1,
                DueDate = DateTime.UtcNow.AddDays(i + 1)
            });
        }

        var page1 = await _client.GetFromJsonAsync<PagedResultDto<TaskDto>>("/api/tasks?page=1&pageSize=10");
        Assert.NotNull(page1);
        Assert.Equal(10, page1.Items.Count);
        Assert.True(page1.TotalCount >= 12);
        Assert.Equal(1, page1.Page);
        Assert.Equal(10, page1.PageSize);
        Assert.True(page1.TotalPages >= 2);

        var page2 = await _client.GetFromJsonAsync<PagedResultDto<TaskDto>>("/api/tasks?page=2&pageSize=10");
        Assert.NotNull(page2);
        Assert.True(page2.Items.Count >= 2);
        Assert.Equal(2, page2.Page);
    }
}
