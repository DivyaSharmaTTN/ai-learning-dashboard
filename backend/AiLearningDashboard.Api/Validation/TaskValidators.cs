using AiLearningDashboard.Api.DTOs;
using AiLearningDashboard.Api.Entities;
using FluentValidation;
using TaskStatus = AiLearningDashboard.Api.Entities.TaskStatus;

namespace AiLearningDashboard.Api.Validation;

public class CreateTaskDtoValidator : AbstractValidator<CreateTaskDto>
{
    public CreateTaskDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200);

        RuleFor(x => x.Description)
            .MaximumLength(2000);

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Category is required.")
            .Must(BeValidCategory).WithMessage("Category is invalid.");

        RuleFor(x => x.Priority)
            .NotEmpty().WithMessage("Priority is required.")
            .Must(BeValidPriority).WithMessage("Priority is invalid.");

        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required.")
            .Must(BeValidStatus).WithMessage("Status is invalid.");

        RuleFor(x => x.OwnerId)
            .GreaterThan(0).WithMessage("Owner is required.");

        RuleFor(x => x.DueDate)
            .NotEmpty().WithMessage("Due date is required.");
    }

    private static bool BeValidCategory(string category) =>
        Enum.TryParse<TaskCategory>(category, true, out _);

    private static bool BeValidPriority(string priority) =>
        Enum.TryParse<TaskPriority>(priority, true, out _);

    private static bool BeValidStatus(string status) =>
        Enum.TryParse<TaskStatus>(status, true, out _);
}

public class UpdateTaskDtoValidator : AbstractValidator<UpdateTaskDto>
{
    public UpdateTaskDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200);

        RuleFor(x => x.Description)
            .MaximumLength(2000);

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Category is required.")
            .Must(BeValidCategory).WithMessage("Category is invalid.");

        RuleFor(x => x.Priority)
            .NotEmpty().WithMessage("Priority is required.")
            .Must(BeValidPriority).WithMessage("Priority is invalid.");

        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required.")
            .Must(BeValidStatus).WithMessage("Status is invalid.");

        RuleFor(x => x.OwnerId)
            .GreaterThan(0).WithMessage("Owner is required.");

        RuleFor(x => x.DueDate)
            .NotEmpty().WithMessage("Due date is required.");
    }

    private static bool BeValidCategory(string category) =>
        Enum.TryParse<TaskCategory>(category, true, out _);

    private static bool BeValidPriority(string priority) =>
        Enum.TryParse<TaskPriority>(priority, true, out _);

    private static bool BeValidStatus(string status) =>
        Enum.TryParse<TaskStatus>(status, true, out _);
}

public class UpdateTaskStatusDtoValidator : AbstractValidator<UpdateTaskStatusDto>
{
    public UpdateTaskStatusDtoValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required.")
            .Must(status => Enum.TryParse<TaskStatus>(status, true, out _))
            .WithMessage("Status is invalid.");
    }
}
