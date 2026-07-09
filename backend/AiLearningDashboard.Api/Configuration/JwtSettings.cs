namespace AiLearningDashboard.Api.Configuration;

public class JwtSettings
{
    public const string SectionName = "Jwt";

    public string Key { get; set; } = string.Empty;
    public string Issuer { get; set; } = "AiLearningDashboard";
    public string Audience { get; set; } = "AiLearningDashboard";
    public int ExpiryMinutes { get; set; } = 60;
}
