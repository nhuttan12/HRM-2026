using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace BackEnd.Features.Auth;

// Signs a JWT containing the identity and database session needed by authentication.
public sealed class TokenService(IConfiguration configuration)
{
    public string Create(AuthUser user, Guid sessionId, DateTime expiresAtUtc)
    {
        // Roles are loaded from the database for each request rather than stored in the token.
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim("session_id", sessionId.ToString())
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Authentication:SigningKey"]!));
        var token = new JwtSecurityToken(
            configuration["Authentication:Issuer"], configuration["Authentication:Audience"], claims,
            expires: expiresAtUtc, signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
