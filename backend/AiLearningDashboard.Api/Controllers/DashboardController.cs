using AiLearningDashboard.Api.DTOs;
using AiLearningDashboard.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AiLearningDashboard.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController(IDashboardService dashboardService) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<ActionResult<DashboardSummaryDto>> GetSummary(CancellationToken cancellationToken)
    {
        var summary = await dashboardService.GetSummaryAsync(cancellationToken);
        return Ok(summary);
    }
}
