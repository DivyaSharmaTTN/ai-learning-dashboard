// @branch feature/task-notifications
// @history 2026-07-13 — List and mark-read APIs for current-user inbox

using AiLearningDashboard.Api.DTOs;
using AiLearningDashboard.Api.Extensions;
using AiLearningDashboard.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AiLearningDashboard.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationsController(INotificationService notificationService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<NotificationDto>>> GetAll(
        [FromQuery] bool unreadOnly = false,
        CancellationToken cancellationToken = default)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var notifications = await notificationService.GetForUserAsync(userId.Value, unreadOnly, cancellationToken);
        return Ok(notifications);
    }

    [HttpGet("unread-count")]
    public async Task<ActionResult<UnreadCountDto>> GetUnreadCount(CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var count = await notificationService.GetUnreadCountAsync(userId.Value, cancellationToken);
        return Ok(new UnreadCountDto { Count = count });
    }

    [HttpPatch("{id:int}/read")]
    public async Task<IActionResult> MarkAsRead(int id, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var (success, error) = await notificationService.MarkAsReadAsync(id, userId.Value, cancellationToken);
        if (error == "Notification not found.")
        {
            return NotFound(new { message = error });
        }

        if (error == "Forbidden.")
        {
            return Forbid();
        }

        if (!success)
        {
            return BadRequest(new { message = error });
        }

        return NoContent();
    }

    [HttpPost("read-all")]
    public async Task<IActionResult> MarkAllAsRead(CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        await notificationService.MarkAllAsReadAsync(userId.Value, cancellationToken);
        return NoContent();
    }
}
