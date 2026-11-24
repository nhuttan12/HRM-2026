using System.Security.Claims;
using System.Text;
using BackEnd.Common.Data;
using BackEnd.Features.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
if (args.Length == 1 && args[0] == "bootstrap-admin")
{
    await AdminBootstrap.RunAsync(builder.Configuration);
    return;
}
var signingKey = builder.Configuration["Authentication:SigningKey"];
var issuer = builder.Configuration["Authentication:Issuer"];
var audience = builder.Configuration["Authentication:Audience"];
if (string.IsNullOrWhiteSpace(signingKey) || Encoding.UTF8.GetByteCount(signingKey) < 32 || string.IsNullOrWhiteSpace(issuer) || string.IsNullOrWhiteSpace(audience))
    throw new InvalidOperationException("Configure Authentication:SigningKey (at least 32 bytes), Issuer and Audience.");
builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();
builder.Services.AddScoped<AuthStore>();
builder.Services.AddScoped<StoredProcedureExecutor>();
builder.Services.AddScoped<IPasswordHasher<AuthUser>, PasswordHasher<AuthUser>>();
builder.Services.AddAntiforgery(options => { options.HeaderName = "X-CSRF-TOKEN"; options.Cookie.Name = "__Host-hrm_csrf"; options.Cookie.Path = "/"; options.Cookie.SecurePolicy = CookieSecurePolicy.Always; options.Cookie.SameSite = SameSiteMode.Strict; });
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.MapInboundClaims = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true, IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey)),
        ValidateIssuer = true, ValidIssuer = issuer, ValidateAudience = true, ValidAudience = audience,
        ValidateLifetime = true, ClockSkew = TimeSpan.Zero
    };
    options.Events = new JwtBearerEvents
    {
        // Only accept the token from the HttpOnly cookie, not from an Authorization header.
        OnMessageReceived = context => { context.Token = context.Request.Cookies[AuthOptions.CookieName] ?? "invalid"; return Task.CompletedTask; },
        OnTokenValidated = async context =>
        {
            var principal = context.Principal!;
            if (!long.TryParse(principal.FindFirstValue(ClaimTypes.NameIdentifier), out var userId) || !Guid.TryParse(principal.FindFirstValue("session_id"), out var sessionId)) { context.Fail("Invalid session."); return; }
            var roles = await context.HttpContext.RequestServices.GetRequiredService<AuthStore>().GetSessionRolesAsync(userId, sessionId, context.HttpContext.RequestAborted);
            if (roles is null) { context.Fail("Session expired or revoked."); return; }
            var identity = (ClaimsIdentity)principal.Identity!;
            foreach (var role in roles) identity.AddClaim(new Claim(ClaimTypes.Role, role));
        }
    };
});
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Candidates.Read", p => p.RequireRole("Admin", "HR", "HiringManager"));
    options.AddPolicy("Candidates.Write", p => p.RequireRole("Admin", "HR"));
    options.AddPolicy("Users.Manage", p => p.RequireRole("Admin"));
});
var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options => options.AddPolicy("Frontend", policy =>
{
    if (origins.Length > 0) policy.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
}));
var app = builder.Build();
app.UseExceptionHandler();
if (app.Environment.IsDevelopment()) app.MapOpenApi();
app.UseHttpsRedirection();
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();

// Cookie authentication requires CSRF validation even on anonymous login.
app.Use(async (context, next) =>
{
    if (HttpMethods.IsPost(context.Request.Method) || HttpMethods.IsPut(context.Request.Method) || HttpMethods.IsPatch(context.Request.Method) || HttpMethods.IsDelete(context.Request.Method))
    {
        try { await context.RequestServices.GetRequiredService<Microsoft.AspNetCore.Antiforgery.IAntiforgery>().ValidateRequestAsync(context); }
        catch (Microsoft.AspNetCore.Antiforgery.AntiforgeryValidationException) { context.Response.StatusCode = 400; await context.Response.WriteAsJsonAsync(new { error = "Invalid CSRF token." }); return; }
    }
    await next();
});
app.MapAuthEndpoints();
app.Run();

public partial class Program { }

