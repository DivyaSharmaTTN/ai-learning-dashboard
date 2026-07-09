using System.Net;
using System.Net.Http.Headers;
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
        builder.UseEnvironment("Testing");
        builder.UseSetting("Jwt:Key", "TestSecretKeyThatIsAtLeast32CharactersLong!");
        builder.UseSetting("Jwt:Issuer", "AiLearningDashboard");
        builder.UseSetting("Jwt:Audience", "AiLearningDashboard");
        builder.UseSetting("Jwt:ExpiryMinutes", "60");

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

public static class AuthTestHelper
{
    public static async Task<string> LoginAsAdminAsync(HttpClient client)
    {
        return await LoginAsync(client, "admin@example.com", "Admin123!");
    }

    public static async Task<string> LoginAsUserAsync(HttpClient client)
    {
        return await LoginAsync(client, "user@example.com", "User123!");
    }

    public static async Task<string> LoginAsync(HttpClient client, string email, string password)
    {
        var response = await client.PostAsJsonAsync("/api/auth/login", new LoginRequestDto
        {
            Email = email,
            Password = password
        });

        response.EnsureSuccessStatusCode();
        var login = await response.Content.ReadFromJsonAsync<LoginResponseDto>();
        return login!.Token;
    }

    public static void SetBearerToken(HttpClient client, string token)
    {
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }
}
