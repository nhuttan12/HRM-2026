using System.Data;
using BackEnd.Common.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;

namespace BackEnd.Features.Auth;

public enum LoginStatus { Success, InvalidInput, InvalidCredentials }
public sealed record LoginResult(LoginStatus Status, string? Token = null, DateTime? ExpiresAtUtc = null);

// Coordinates credential validation, session creation, and token issuance.
public sealed class LoginService(
    IStoredProcedureExecutor procedures,
    IPasswordHasher<AuthUser> hasher,
    SessionService sessions,
    TokenService tokens)
{
    public async Task<LoginResult> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        // Reject missing credentials before querying the database.
        if (string.IsNullOrWhiteSpace(request.UserName) || string.IsNullOrWhiteSpace(request.Password))
        {
            return new(LoginStatus.InvalidInput);
        }

        // Normalize the login name in the same way as registration before searching.
        var users = await procedures.QueryAsync(
            "dbo.Auth_FindUserByNormalizedName",
            reader => new AuthUser(
                reader.GetInt64(0), reader.GetString(1), reader.GetString(2), reader.GetBoolean(3),
                reader.GetInt32(4),
                reader.IsDBNull(5) ? null : DateTime.SpecifyKind(reader.GetDateTime(5), DateTimeKind.Utc)),
            [new SqlParameter("@NormalizedUserName", SqlDbType.NVarChar, -1)
                { Value = request.UserName.Trim().ToUpperInvariant() }],
            cancellationToken);

        // Inactive and temporarily locked accounts cannot start a new session.
        var user = users.FirstOrDefault();
        if (user is null || !user.IsActive || user.LockoutEndUtc > DateTime.UtcNow)
        {
            return new(LoginStatus.InvalidCredentials);
        }

        // Verify the password against the stored Identity hash; record failed attempts.
        if (hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password) ==
            PasswordVerificationResult.Failed)
        {
            await procedures.ExecuteAsync(
                "dbo.Auth_RecordLoginFailure",
                [new SqlParameter("@UserId", SqlDbType.BigInt) { Value = user.Id }],
                cancellationToken);
            return new(LoginStatus.InvalidCredentials);
        }

        // The JWT and its revocable database session share the same expiration time.
        var expiry = DateTime.UtcNow.AddMinutes(30);
        var sessionId = await sessions.CreateAsync(user.Id, expiry, cancellationToken);
        return new(LoginStatus.Success, tokens.Create(user, sessionId, expiry), expiry);
    }
}
