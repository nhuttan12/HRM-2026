using Microsoft.AspNetCore.Antiforgery;

namespace BackEnd.Features.Auth;

public sealed class AntiforgeryValidationMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        // Cookie authentication requires CSRF validation even on anonymous login.
        if (HttpMethods.IsPost(context.Request.Method) || HttpMethods.IsPut(context.Request.Method) ||
            HttpMethods.IsPatch(context.Request.Method) || HttpMethods.IsDelete(context.Request.Method))
        {
            try
            {
                var antiforgery = context.RequestServices.GetRequiredService<IAntiforgery>();
                await antiforgery.ValidateRequestAsync(context);
            }
            catch (AntiforgeryValidationException)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsJsonAsync(new { error = "Invalid CSRF token." });
                return;
            }
        }

        await next(context);
    }
}
