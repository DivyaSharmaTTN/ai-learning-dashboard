using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AiLearningDashboard.Api.Configuration;
using AiLearningDashboard.Api.DTOs;
using AiLearningDashboard.Api.Entities;
using AiLearningDashboard.Api.Repositories;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace AiLearningDashboard.Api.Services;

public interface IAuthService
{
    Task<(LoginResponseDto? Response, string? Error)> LoginAsync(
        LoginRequestDto request,
        CancellationToken cancellationToken = default);
}

public class AuthService(IUserRepository userRepository, IOptions<JwtSettings> jwtOptions) : IAuthService
{
    public async Task<(LoginResponseDto? Response, string? Error)> LoginAsync(
        LoginRequestDto request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return (null, "Email and password are required.");
        }

        var user = await userRepository.GetByEmailAsync(request.Email.Trim(), cancellationToken);
        if (user is null || string.IsNullOrEmpty(user.PasswordHash))
        {
            return (null, "Invalid email or password.");
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return (null, "Invalid email or password.");
        }

        var settings = jwtOptions.Value;
        if (string.IsNullOrWhiteSpace(settings.Key))
        {
            return (null, "Authentication is not configured.");
        }

        var expiresAt = DateTime.UtcNow.AddMinutes(settings.ExpiryMinutes);
        var token = GenerateToken(user, settings, expiresAt);

        return (new LoginResponseDto
        {
            Token = token,
            ExpiresAt = expiresAt,
            User = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            }
        }, null);
    }

    private static string GenerateToken(User user, JwtSettings settings, DateTime expiresAt)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(ClaimTypes.Name, user.Name),
            new(ClaimTypes.Role, user.Role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Key));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: settings.Issuer,
            audience: settings.Audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
