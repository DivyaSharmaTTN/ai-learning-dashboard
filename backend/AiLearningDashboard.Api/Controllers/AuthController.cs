using AiLearningDashboard.Api.DTOs;
using AiLearningDashboard.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AiLearningDashboard.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(
        [FromBody] LoginRequestDto request,
        CancellationToken cancellationToken)
    {
        var (response, error) = await authService.LoginAsync(request, cancellationToken);
        if (error is not null)
        {
            return Unauthorized(new { message = error });
        }

        return Ok(response);
    }
}
