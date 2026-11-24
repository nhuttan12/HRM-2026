using System.Security.Claims;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Features.Auth;

[ApiController]
[Route("api/auth")]
// Translates authentication requests and service results into HTTP responses.
public sealed class AuthController(
    LoginService loginService,
    RegistrationService registrationService,
    SessionService sessionService,
    IAntiforgery antiforgery) : ControllerBase
{
    [AllowAnonymous]
    [HttpGet("csrf")]
    public IActionResult Csrf()
    {
        // Issue a request token paired with an antiforgery cookie for subsequent POST requests.
        var tokens = antiforgery.GetAndStoreTokens(HttpContext);
        return Ok(new { requestToken = tokens.RequestToken, headerName = tokens.HeaderName });
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        // The service validates credentials and returns a signed token only on success.
        var result = await loginService.LoginAsync(request, cancellationToken);
        if (result.Status == LoginStatus.InvalidInput) return BadRequest();
        if (result.Status == LoginStatus.InvalidCredentials) return Unauthorized();

        // Send the token in a protected cookie with the same expiration as the session.
        var options = AuthOptions.CookieOptions();
        options.Expires = result.ExpiresAtUtc;
        Response.Cookies.Append(AuthOptions.CookieName, result.Token!, options);
        return NoContent();
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request, CancellationToken cancellationToken)
    {
        // A new account is created without a role; authorization is assigned separately.
        var result = await registrationService.RegisterAsync(request, cancellationToken);
        return result switch
        {
            RegistrationStatus.InvalidInput => BadRequest(),
            RegistrationStatus.UserNameExists => Conflict(new { error = "Username already exists." }),
            _ => StatusCode(StatusCodes.Status201Created)
        };
    }

    [Authorize]
    [HttpGet("me")]
    // Authentication middleware has already checked the session and attached current roles.
    public IActionResult Me() => Ok(new
    {
        id = User.FindFirstValue(ClaimTypes.NameIdentifier),
        userName = User.Identity?.Name,
        roles = User.FindAll(ClaimTypes.Role).Select(x => x.Value)
    });

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        // Revoke the session in the database before removing the client-side cookie.
        if (long.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId) &&
            Guid.TryParse(User.FindFirstValue("session_id"), out var sessionId))
        {
            await sessionService.RevokeAsync(userId, sessionId, cancellationToken);
        }
        Response.Cookies.Delete(AuthOptions.CookieName, AuthOptions.CookieOptions());
        return NoContent();
    }
}
