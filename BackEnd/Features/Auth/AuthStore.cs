using System.Data;
using Microsoft.Data.SqlClient;

namespace BackEnd.Features.Auth;

public sealed record AuthUser(long Id, string UserName, string PasswordHash, bool IsActive, int FailedLoginCount, DateTime? LockoutEndUtc);

public sealed class AuthStore(IConfiguration config)
{
    private SqlConnection OpenConnection() => new(config.GetConnectionString("Hrm")
        ?? throw new InvalidOperationException("ConnectionStrings:Hrm is not configured."));

    public async Task<AuthUser?> FindUserAsync(string name, CancellationToken ct)
    {
        await using var connection = OpenConnection();
        await connection.OpenAsync(ct);
        await using var command = new SqlCommand("SELECT Id, UserName, PasswordHash, IsActive, FailedLoginCount, LockoutEndUtc FROM dbo.AppUser WHERE NormalizedUserName = @name", connection);
        command.Parameters.Add("@name", SqlDbType.NVarChar, 256).Value = name.Trim().ToUpperInvariant();
        await using var reader = await command.ExecuteReaderAsync(ct);
        return await reader.ReadAsync(ct) ? new(reader.GetInt64(0), reader.GetString(1), reader.GetString(2), reader.GetBoolean(3), reader.GetInt32(4), reader.IsDBNull(5) ? null : DateTime.SpecifyKind(reader.GetDateTime(5), DateTimeKind.Utc)) : null;
    }

    public async Task RecordFailureAsync(long id, CancellationToken ct)
    {
        await using var connection = OpenConnection(); await connection.OpenAsync(ct);
        await using var command = new SqlCommand("UPDATE dbo.AppUser SET FailedLoginCount = CASE WHEN FailedLoginCount + 1 >= 5 THEN 0 ELSE FailedLoginCount + 1 END, LockoutEndUtc = CASE WHEN FailedLoginCount + 1 >= 5 THEN DATEADD(minute, 15, SYSUTCDATETIME()) ELSE LockoutEndUtc END WHERE Id = @id", connection);
        command.Parameters.Add("@id", SqlDbType.BigInt).Value = id;
        await command.ExecuteNonQueryAsync(ct);
    }

    public async Task<Guid> CreateSessionAsync(long id, DateTime expiry, CancellationToken ct)
    {
        await using var connection = OpenConnection(); await connection.OpenAsync(ct);
        var session = Guid.NewGuid();
        await using var command = new SqlCommand("UPDATE dbo.AppUser SET FailedLoginCount = 0, LockoutEndUtc = NULL WHERE Id = @id; INSERT dbo.AuthSession (Id, UserId, ExpiresAtUtc) VALUES (@session, @id, @expiry)", connection);
        command.Parameters.Add("@id", SqlDbType.BigInt).Value = id;
        command.Parameters.Add("@session", SqlDbType.UniqueIdentifier).Value = session;
        command.Parameters.Add("@expiry", SqlDbType.DateTime2).Value = expiry;
        await command.ExecuteNonQueryAsync(ct); return session;
    }

    public async Task<List<string>?> GetSessionRolesAsync(long userId, Guid session, CancellationToken ct)
    {
        await using var connection = OpenConnection(); await connection.OpenAsync(ct);
        await using var command = new SqlCommand("SELECT r.Name FROM dbo.AuthSession s JOIN dbo.AppUser u ON u.Id = s.UserId LEFT JOIN dbo.AppUserRole ur ON ur.UserId = u.Id LEFT JOIN dbo.AppRole r ON r.Id = ur.RoleId WHERE s.Id = @session AND s.UserId = @user AND s.RevokedAtUtc IS NULL AND s.ExpiresAtUtc > SYSUTCDATETIME() AND u.IsActive = 1", connection);
        command.Parameters.Add("@session", SqlDbType.UniqueIdentifier).Value = session;
        command.Parameters.Add("@user", SqlDbType.BigInt).Value = userId;
        await using var reader = await command.ExecuteReaderAsync(ct);
        var roles = new List<string>(); var found = false;
        while (await reader.ReadAsync(ct)) { found = true; if (!reader.IsDBNull(0)) roles.Add(reader.GetString(0)); }
        return found ? roles : null;
    }

    public async Task RevokeAsync(long userId, Guid session, CancellationToken ct)
    {
        await using var connection = OpenConnection(); await connection.OpenAsync(ct);
        await using var command = new SqlCommand("UPDATE dbo.AuthSession SET RevokedAtUtc = SYSUTCDATETIME() WHERE Id = @session AND UserId = @user AND RevokedAtUtc IS NULL", connection);
        command.Parameters.Add("@session", SqlDbType.UniqueIdentifier).Value = session;
        command.Parameters.Add("@user", SqlDbType.BigInt).Value = userId;
        await command.ExecuteNonQueryAsync(ct);
    }
}
