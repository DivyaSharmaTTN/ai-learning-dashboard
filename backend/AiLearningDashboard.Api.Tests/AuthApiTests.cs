using System.Net;
using System.Net.Http.Json;
using AiLearningDashboard.Api.DTOs;

namespace AiLearningDashboard.Api.Tests;

public class AuthApiTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public AuthApiTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Login_WithValidAdminCredentials_ReturnsToken()
    {
        var response = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequestDto
        {
            Email = "admin@example.com",
            Password = "Admin123!"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var login = await response.Content.ReadFromJsonAsync<LoginResponseDto>();
        Assert.NotNull(login);
        Assert.False(string.IsNullOrWhiteSpace(login.Token));
        Assert.Equal("Admin", login.User.Role);
        Assert.Equal("admin@example.com", login.User.Email);
    }

    [Fact]
    public async Task Login_WithValidUserCredentials_ReturnsToken()
    {
        var response = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequestDto
        {
            Email = "user@example.com",
            Password = "User123!"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var login = await response.Content.ReadFromJsonAsync<LoginResponseDto>();
        Assert.NotNull(login);
        Assert.Equal("User", login.User.Role);
    }

    [Fact]
    public async Task Login_WithInvalidPassword_ReturnsUnauthorized()
    {
        var response = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequestDto
        {
            Email = "admin@example.com",
            Password = "WrongPassword!"
        });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetTasks_WithoutToken_ReturnsUnauthorized()
    {
        var response = await _client.GetAsync("/api/tasks");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task DashboardSummary_AsUser_ReturnsForbidden()
    {
        var token = await AuthTestHelper.LoginAsUserAsync(_client);
        AuthTestHelper.SetBearerToken(_client, token);

        var response = await _client.GetAsync("/api/dashboard/summary");
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task CreateTask_AsUser_ReturnsForbidden()
    {
        var token = await AuthTestHelper.LoginAsUserAsync(_client);
        AuthTestHelper.SetBearerToken(_client, token);

        var response = await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "User Created Task",
            Category = "Learning",
            Priority = "Low",
            Status = "NotStarted",
            OwnerId = 5,
            DueDate = DateTime.UtcNow.AddDays(3)
        });

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task User_CanViewOnlyAssignedTasks()
    {
        var adminToken = await AuthTestHelper.LoginAsAdminAsync(_client);
        AuthTestHelper.SetBearerToken(_client, adminToken);

        await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Assigned To User",
            Category = "Learning",
            Priority = "Medium",
            Status = "NotStarted",
            OwnerId = 5,
            DueDate = DateTime.UtcNow.AddDays(4)
        });

        await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Assigned To Alex",
            Category = "Project",
            Priority = "Low",
            Status = "NotStarted",
            OwnerId = 1,
            DueDate = DateTime.UtcNow.AddDays(4)
        });

        var userToken = await AuthTestHelper.LoginAsUserAsync(_client);
        AuthTestHelper.SetBearerToken(_client, userToken);

        var tasks = await _client.GetFromJsonAsync<List<TaskDto>>("/api/tasks");
        Assert.NotNull(tasks);
        Assert.Contains(tasks, t => t.Title == "Assigned To User");
        Assert.DoesNotContain(tasks, t => t.Title == "Assigned To Alex");
        Assert.All(tasks, t => Assert.Equal(5, t.OwnerId));
    }

    [Fact]
    public async Task User_CanUpdateStatusOnOwnTask_ButNotOthers()
    {
        var adminToken = await AuthTestHelper.LoginAsAdminAsync(_client);
        AuthTestHelper.SetBearerToken(_client, adminToken);

        var ownTaskResponse = await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "User Own Status Task",
            Category = "Learning",
            Priority = "Low",
            Status = "NotStarted",
            OwnerId = 5,
            DueDate = DateTime.UtcNow.AddDays(2)
        });
        var ownTask = await ownTaskResponse.Content.ReadFromJsonAsync<TaskDto>();

        var otherTaskResponse = await _client.PostAsJsonAsync("/api/tasks", new CreateTaskDto
        {
            Title = "Other Owner Status Task",
            Category = "Learning",
            Priority = "Low",
            Status = "NotStarted",
            OwnerId = 1,
            DueDate = DateTime.UtcNow.AddDays(2)
        });
        var otherTask = await otherTaskResponse.Content.ReadFromJsonAsync<TaskDto>();

        var userToken = await AuthTestHelper.LoginAsUserAsync(_client);
        AuthTestHelper.SetBearerToken(_client, userToken);

        var ownPatch = await _client.PatchAsJsonAsync(
            $"/api/tasks/{ownTask!.Id}/status",
            new UpdateTaskStatusDto { Status = "InProgress" });
        Assert.Equal(HttpStatusCode.OK, ownPatch.StatusCode);

        var otherPatch = await _client.PatchAsJsonAsync(
            $"/api/tasks/{otherTask!.Id}/status",
            new UpdateTaskStatusDto { Status = "InProgress" });
        Assert.Equal(HttpStatusCode.Forbidden, otherPatch.StatusCode);
    }
}
