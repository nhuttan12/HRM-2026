using BackEnd.Common.Data;
using BackEnd.Features.Auth;

namespace BackEnd.Infrastructure;

public static class ApplicationServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Register shared framework, database, and feature-specific services.
        services.AddOpenApi();
        services.AddProblemDetails();
        services.AddControllers();
        services.AddDataAccess();
        services.AddAuthFeature(configuration);

        // Allow credentialed browser requests only from explicitly configured origins.
        var origins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
        services.AddCors(options => options.AddPolicy("Frontend", policy =>
        {
            if (origins.Length > 0)
            {
                policy.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
            }
        }));

        return services;
    }
}
