// @branch feature/task-notifications
// @history 2026-07-13 — Integration tests for assignment/status notifications and mark-read

using System.Net;
using System.Net.Http.Json;
using AiLearningDashboard.Api.DTOs;

namespace AiLearningDashboard.Api.Tests;

public class NotificationsApiTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public NotificationsApiTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    private async Task AuthenticateAsAdminAsync()
    {
        var token = await AuthTestHelper.LoginAsAdminAsync(_client);
        AuthTestHelper.SetBearerToken(_client, token);
    }

    private async Task AuthenticateAsUserAsync()
    {
        var token = await AuthTestHelper.LoginAsUserAsync(_client);
        AuthTestHelper.SetBearerToken(_client, token);
    }

    [Fact]
    public async Task CreateTask_AssignedToUser_NotifiesRecipient()
    {
        await AuthenticateAsAdminAsync();
        var createResponse = await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Notify Assign Task",
            Category = "Learning",
            Priority = "Medium",
            Status = "NotStarted",
            OwnerId = 5,
            DueDate = DateTime.UtcNow.AddDays(4)
        });

        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);
        var task = await createResponse.Content.ReadFromJsonAsync<TaskDto>();
        Assert.NotNull(task);

        await AuthenticateAsUserAsync();
        var notifications = await _client.GetFromJsonAsync<List<NotificationDto>>("/api/notifications");

        Assert.NotNull(notifications);
        Assert.Contains(notifications, n =>
            n.TaskId == task.Id &&
            n.Message == "A new task has been assigned to you." &&
            n.Type == "TaskAssigned" &&
            !n.IsRead);
    }

    [Fact]
    public async Task UserStartsTask_NotifiesAdmin()
    {
        await AuthenticateAsAdminAsync();
        var createResponse = await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Admin Task",
            Category = "Learning",
            Priority = "Medium",
            Status = "NotStarted",
            OwnerId = 5,
            DueDate = DateTime.UtcNow.AddDays(3)
        });
        var task = await createResponse.Content.ReadFromJsonAsync<TaskDto>();
        Assert.NotNull(task);

        await AuthenticateAsUserAsync();
        var patchResponse = await _client.PatchAsJsonAsync(
            $"/api/tasks/{task.Id}/status",
            new UpdateTaskStatusDto { Status = "InProgress" });
        Assert.Equal(HttpStatusCode.OK, patchResponse.StatusCode);

        await AuthenticateAsAdminAsync();
        var notifications = await _client.GetFromJsonAsync<List<NotificationDto>>("/api/notifications");

        Assert.NotNull(notifications);
        Assert.Contains(notifications, n =>
            n.TaskId == task.Id &&
            n.Message == "User started Admin Task." &&
            n.Type == "TaskStarted" &&
            !n.IsRead);
    }

    [Fact]
    public async Task UserCompletesTask_NotifiesAdmin()
    {
        await AuthenticateAsAdminAsync();
        var createResponse = await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Finish Me",
            Category = "Project",
            Priority = "High",
            Status = "InProgress",
            OwnerId = 5,
            DueDate = DateTime.UtcNow.AddDays(2)
        });
        var task = await createResponse.Content.ReadFromJsonAsync<TaskDto>();
        Assert.NotNull(task);

        await AuthenticateAsUserAsync();
        var patchResponse = await _client.PatchAsJsonAsync(
            $"/api/tasks/{task.Id}/status",
            new UpdateTaskStatusDto { Status = "Completed" });
        Assert.Equal(HttpStatusCode.OK, patchResponse.StatusCode);

        await AuthenticateAsAdminAsync();
        var notifications = await _client.GetFromJsonAsync<List<NotificationDto>>("/api/notifications");

        Assert.NotNull(notifications);
        Assert.Contains(notifications, n =>
            n.TaskId == task.Id &&
            n.Message == "User completed Finish Me." &&
            n.Type == "TaskCompleted");
    }

    [Fact]
    public async Task MarkAsRead_UpdatesIsReadAndUnreadCount()
    {
        await AuthenticateAsAdminAsync();
        var createResponse = await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Mark Read Task",
            Category = "Other",
            Priority = "Low",
            Status = "NotStarted",
            OwnerId = 5,
            DueDate = DateTime.UtcNow.AddDays(1)
        });
        var task = await createResponse.Content.ReadFromJsonAsync<TaskDto>();
        Assert.NotNull(task);

        await AuthenticateAsUserAsync();
        var notifications = await _client.GetFromJsonAsync<List<NotificationDto>>("/api/notifications");
        var target = Assert.Single(notifications!, n => n.TaskId == task.Id);

        var markResponse = await _client.PatchAsync($"/api/notifications/{target.Id}/read", null);
        Assert.Equal(HttpStatusCode.NoContent, markResponse.StatusCode);

        var after = await _client.GetFromJsonAsync<List<NotificationDto>>("/api/notifications");
        Assert.Contains(after!, n => n.Id == target.Id && n.IsRead);

        var count = await _client.GetFromJsonAsync<UnreadCountDto>("/api/notifications/unread-count");
        Assert.NotNull(count);
        Assert.DoesNotContain(after!, n => !n.IsRead && n.Id == target.Id);
    }

    [Fact]
    public async Task MarkAllAsRead_ClearsUnreadForCurrentUser()
    {
        await AuthenticateAsAdminAsync();
        await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Mark All One",
            Category = "Learning",
            Priority = "Medium",
            Status = "NotStarted",
            OwnerId = 5,
            DueDate = DateTime.UtcNow.AddDays(1)
        });
        await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Mark All Two",
            Category = "Learning",
            Priority = "Medium",
            Status = "NotStarted",
            OwnerId = 5,
            DueDate = DateTime.UtcNow.AddDays(2)
        });

        await AuthenticateAsUserAsync();
        var markAll = await _client.PostAsync("/api/notifications/read-all", null);
        Assert.Equal(HttpStatusCode.NoContent, markAll.StatusCode);

        var count = await _client.GetFromJsonAsync<UnreadCountDto>("/api/notifications/unread-count");
        Assert.Equal(0, count?.Count);

        var notifications = await _client.GetFromJsonAsync<List<NotificationDto>>("/api/notifications");
        Assert.NotNull(notifications);
        Assert.All(notifications, n => Assert.True(n.IsRead));
    }

    [Fact]
    public async Task MarkAsRead_OtherUsersNotification_ReturnsForbid()
    {
        await AuthenticateAsAdminAsync();
        var createResponse = await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Private Notify",
            Category = "Learning",
            Priority = "Medium",
            Status = "NotStarted",
            OwnerId = 5,
            DueDate = DateTime.UtcNow.AddDays(1)
        });
        var task = await createResponse.Content.ReadFromJsonAsync<TaskDto>();
        Assert.NotNull(task);

        await AuthenticateAsUserAsync();
        var userNotifications = await _client.GetFromJsonAsync<List<NotificationDto>>("/api/notifications");
        var target = Assert.Single(userNotifications!, n => n.TaskId == task.Id);

        await AuthenticateAsAdminAsync();
        var response = await _client.PatchAsync($"/api/notifications/{target.Id}/read", null);
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task GetNotifications_Unauthenticated_ReturnsUnauthorized()
    {
        _client.DefaultRequestHeaders.Authorization = null;
        var response = await _client.GetAsync("/api/notifications");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
