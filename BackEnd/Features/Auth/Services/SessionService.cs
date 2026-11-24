using System.Data;
using BackEnd.Common.Data;
using Microsoft.Data.SqlClient;

namespace BackEnd.Features.Auth;

// Manages database-backed sessions and retrieves the user's roles for a valid session.
public sealed class SessionService(IStoredProcedureExecutor procedures)
{
    public async Task<Guid> CreateAsync(long userId, DateTime expiry, CancellationToken cancellationToken)
    {
        // Generate the identifier here so the same value can be included in the JWT.
        var sessionId = Guid.NewGuid();
        await procedures.ExecuteAsync(
            "dbo.Auth_CreateSession",
            [
                new SqlParameter("@UserId", SqlDbType.BigInt) { Value = userId },
                new SqlParameter("@SessionId", SqlDbType.UniqueIdentifier) { Value = sessionId },
                new SqlParameter("@ExpiresAtUtc", SqlDbType.DateTime2) { Value = expiry }
            ], cancellationToken);
        return sessionId;
    }

    public async Task<List<string>?> GetRolesAsync(long userId, Guid sessionId, CancellationToken cancellationToken)
    {
        var roles = await procedures.QueryAsync<string?>(
            "dbo.Auth_GetSessionRoles",
            reader => reader.IsDBNull(0) ? null : reader.GetString(0),
            [
                new SqlParameter("@UserId", SqlDbType.BigInt) { Value = userId },
                new SqlParameter("@SessionId", SqlDbType.UniqueIdentifier) { Value = sessionId }
            ], cancellationToken);
        // No rows means an invalid session; a NULL role means a valid session without roles.
        return roles.Count == 0 ? null : roles.OfType<string>().ToList();
    }

    public async Task RevokeAsync(long userId, Guid sessionId, CancellationToken cancellationToken)
    {
        // Revocation makes this session unusable even if its JWT has not expired yet.
        await procedures.ExecuteAsync(
            "dbo.Auth_RevokeSession",
            [
                new SqlParameter("@UserId", SqlDbType.BigInt) { Value = userId },
                new SqlParameter("@SessionId", SqlDbType.UniqueIdentifier) { Value = sessionId }
            ], cancellationToken);
    }
}
