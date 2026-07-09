using System.Security.Claims;
using AiLearningDashboard.Api.Entities;

namespace AiLearningDashboard.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static int? GetUserId(this ClaimsPrincipal principal)
    {
        var idClaim = principal.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? principal.FindFirstValue("sub");

        return int.TryParse(idClaim, out var userId) ? userId : null;
    }

    public static bool IsAdmin(this ClaimsPrincipal principal) =>
        principal.IsInRole(AuthRoles.Admin);
}
