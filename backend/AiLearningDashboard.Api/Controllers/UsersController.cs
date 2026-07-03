using AiLearningDashboard.Api.DTOs;
using AiLearningDashboard.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AiLearningDashboard.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(IUserService userService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<UserDto>>> GetAll(CancellationToken cancellationToken)
    {
        var users = await userService.GetAllAsync(cancellationToken);
        return Ok(users);
    }
}
