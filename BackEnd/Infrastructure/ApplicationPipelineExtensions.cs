using BackEnd.Features.Auth;

namespace BackEnd.Infrastructure;

public static class ApplicationPipelineExtensions
{
    public static WebApplication UseApplicationPipeline(this WebApplication app)
    {
        // Handle errors globally and expose OpenAPI only in development.
        app.UseExceptionHandler();
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        // Keep authentication before authorization and CSRF validation in the request pipeline.
        app.UseHttpsRedirection();
        app.UseCors("Frontend");
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseMiddleware<AntiforgeryValidationMiddleware>();

        return app;
    }
}
