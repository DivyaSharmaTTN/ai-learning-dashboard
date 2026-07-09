using AiLearningDashboard.Api.DTOs;
using AiLearningDashboard.Api.Entities;
using AiLearningDashboard.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AiLearningDashboard.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize(Roles = AuthRoles.Admin)]
public class DashboardController(IDashboardService dashboardService) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<ActionResult<DashboardSummaryDto>> GetSummary(CancellationToken cancellationToken)
    {
        var summary = await dashboardService.GetSummaryAsync(cancellationToken);
        return Ok(summary);
    }
}
