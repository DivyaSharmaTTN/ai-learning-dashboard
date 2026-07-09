// @branch feature/stretch-activity-log
// @history 2026-07-09 — GET /api/tasks/{id}/activity endpoint

using AiLearningDashboard.Api.DTOs;
using AiLearningDashboard.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AiLearningDashboard.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController(ITaskService taskService, IActivityLogService activityLogService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<TaskDto>>> GetAll(
        [FromQuery] string? search,
        [FromQuery] string? status,
        CancellationToken cancellationToken)
    {
        var tasks = await taskService.GetAllAsync(search, status, cancellationToken);
        return Ok(tasks);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TaskDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var task = await taskService.GetByIdAsync(id, cancellationToken);
        if (task is null)
        {
            return NotFound(new { message = "Task not found." });
        }

        return Ok(task);
    }

    [HttpGet("{id:int}/activity")]
    public async Task<ActionResult<List<ActivityLogDto>>> GetActivity(
        int id,
        CancellationToken cancellationToken)
    {
        var task = await taskService.GetByIdAsync(id, cancellationToken);
        if (task is null)
        {
            return NotFound(new { message = "Task not found." });
        }

        var activity = await activityLogService.GetByTaskIdAsync(id, cancellationToken);
        return Ok(activity);
    }

    [HttpPost]
    public async Task<ActionResult<TaskDto>> Create(
        [FromBody] CreateTaskDto dto,
        CancellationToken cancellationToken)
    {
        var (task, error) = await taskService.CreateAsync(dto, cancellationToken);
        if (error is not null)
        {
            return BadRequest(new { message = error });
        }

        return CreatedAtAction(nameof(GetById), new { id = task!.Id }, task);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TaskDto>> Update(
        int id,
        [FromBody] UpdateTaskDto dto,
        CancellationToken cancellationToken)
    {
        var (task, error) = await taskService.UpdateAsync(id, dto, cancellationToken);
        if (error == "Task not found.")
        {
            return NotFound(new { message = error });
        }

        if (error is not null)
        {
            return BadRequest(new { message = error });
        }

        return Ok(task);
    }

    [HttpPatch("{id:int}/status")]
    public async Task<ActionResult<TaskDto>> UpdateStatus(
        int id,
        [FromBody] UpdateTaskStatusDto dto,
        CancellationToken cancellationToken)
    {
        var (task, error) = await taskService.UpdateStatusAsync(id, dto.Status, cancellationToken);
        if (error == "Task not found.")
        {
            return NotFound(new { message = error });
        }

        if (error is not null)
        {
            return BadRequest(new { message = error });
        }

        return Ok(task);
    }
}
