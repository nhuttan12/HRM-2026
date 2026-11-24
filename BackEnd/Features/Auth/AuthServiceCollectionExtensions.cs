using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace BackEnd.Features.Auth;

public static class AuthServiceCollectionExtensions
{
    public static IServiceCollection AddAuthFeature(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Fail at startup if the JWT signing and validation settings are incomplete.
        var signingKey = configuration["Authentication:SigningKey"];
        var issuer = configuration["Authentication:Issuer"];
        var audience = configuration["Authentication:Audience"];

        if (string.IsNullOrWhiteSpace(signingKey) || Encoding.UTF8.GetByteCount(signingKey) < 32 ||
            string.IsNullOrWhiteSpace(issuer) || string.IsNullOrWhiteSpace(audience))
        {
            throw new InvalidOperationException(
                "Configure Authentication:SigningKey (at least 32 bytes), Issuer and Audience.");
        }

        // Services are scoped to a request and share the configured password hasher.
        services.AddScoped<LoginService>();
        services.AddScoped<RegistrationService>();
        services.AddScoped<SessionService>();
        services.AddScoped<TokenService>();
        services.AddScoped<IPasswordHasher<AuthUser>, PasswordHasher<AuthUser>>();

        // Pair the CSRF header with a secure cookie for state-changing requests.
        services.AddAntiforgery(options =>
        {
            options.HeaderName = "X-CSRF-TOKEN";
            options.Cookie.Name = "__Host-hrm_csrf";
            options.Cookie.Path = "/";
            options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            options.Cookie.SameSite = SameSiteMode.Strict;
        });

        // Validate the JWT signature, issuer, audience, and expiration on each request.
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
        {
            options.MapInboundClaims = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey)),
                ValidateIssuer = true,
                ValidIssuer = issuer,
                ValidateAudience = true,
                ValidAudience = audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    // Only accept the token from the HttpOnly cookie.
                    context.Token = context.Request.Cookies[AuthOptions.CookieName] ?? "invalid";
                    return Task.CompletedTask;
                },
                OnTokenValidated = async context =>
                {
                    var principal = context.Principal!;
                    if (!long.TryParse(principal.FindFirstValue(ClaimTypes.NameIdentifier), out var userId) ||
                        !Guid.TryParse(principal.FindFirstValue("session_id"), out var sessionId))
                    {
                        context.Fail("Invalid session.");
                        return;
                    }

                    // Reject revoked or expired sessions and load the current roles from the database.
                    var sessions = context.HttpContext.RequestServices.GetRequiredService<SessionService>();
                    var roles = await sessions.GetRolesAsync(
                        userId,
                        sessionId,
                        context.HttpContext.RequestAborted);
                    if (roles is null)
                    {
                        context.Fail("Session expired or revoked.");
                        return;
                    }

                    var identity = (ClaimsIdentity)principal.Identity!;
                    foreach (var role in roles)
                    {
                        identity.AddClaim(new Claim(ClaimTypes.Role, role));
                    }
                }
            };
        });

        // These current policies use fixed role names; database permission grants are not yet enforced.
        services.AddAuthorization(options =>
        {
            options.AddPolicy("Candidates.Read", p => p.RequireRole("Admin", "HR", "HiringManager"));
            options.AddPolicy("Candidates.Write", p => p.RequireRole("Admin", "HR"));
            options.AddPolicy("Users.Manage", p => p.RequireRole("Admin"));
        });

        return services;
    }
}
