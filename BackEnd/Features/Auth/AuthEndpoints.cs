using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace BackEnd.Features.Auth;

public sealed record LoginRequest(string UserName, string Password);

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth");
        group.MapGet("/csrf", (HttpContext context, IAntiforgery antiforgery) =>
        {
            var tokens = antiforgery.GetAndStoreTokens(context);
            return Results.Ok(new { requestToken = tokens.RequestToken, headerName = tokens.HeaderName });
        }).AllowAnonymous();
        group.MapPost("/login", LoginAsync).AllowAnonymous();
        group.MapGet("/me", (ClaimsPrincipal user) => Results.Ok(new {
            id = user.FindFirstValue(ClaimTypes.NameIdentifier),
            userName = user.Identity?.Name,
            roles = user.FindAll(ClaimTypes.Role).Select(x => x.Value)
        })).RequireAuthorization();
        group.MapPost("/logout", async (ClaimsPrincipal user, HttpContext context, AuthStore store, CancellationToken ct) =>
        {
            if (long.TryParse(user.FindFirstValue(ClaimTypes.NameIdentifier), out var id) && Guid.TryParse(user.FindFirstValue("session_id"), out var session))
                await store.RevokeAsync(id, session, ct);
            context.Response.Cookies.Delete(AuthOptions.CookieName, AuthOptions.CookieOptions());
            return Results.NoContent();
        }).RequireAuthorization();
        return app;
    }

    private static async Task<IResult> LoginAsync(LoginRequest request, HttpContext context, AuthStore store,
        IPasswordHasher<AuthUser> hasher, IConfiguration config, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.UserName) || string.IsNullOrEmpty(request.Password) || request.UserName.Length > 256 || request.Password.Length > 1024)
            return Results.BadRequest();
        var user = await store.FindUserAsync(request.UserName, ct);
        if (user is null || !user.IsActive || user.LockoutEndUtc > DateTime.UtcNow)
            return Results.Unauthorized();
        if (hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password) == PasswordVerificationResult.Failed)
        {
            await store.RecordFailureAsync(user.Id, ct);
            return Results.Unauthorized();
        }
        var expiry = DateTime.UtcNow.AddMinutes(30);
        var session = await store.CreateSessionAsync(user.Id, expiry, ct);
        var claims = new[] { new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), new Claim(ClaimTypes.Name, user.UserName), new Claim("session_id", session.ToString()) };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Authentication:SigningKey"]!));
        var token = new JwtSecurityToken(config["Authentication:Issuer"], config["Authentication:Audience"], claims, expires: expiry, signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));
        var options = AuthOptions.CookieOptions(); options.Expires = expiry;
        context.Response.Cookies.Append(AuthOptions.CookieName, new JwtSecurityTokenHandler().WriteToken(token), options);
        return Results.NoContent();
    }
}

public static class AuthOptions
{
    public const string CookieName = "__Host-hrm_access";
    public static CookieOptions CookieOptions() => new() { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict, Path = "/", IsEssential = true };
}
