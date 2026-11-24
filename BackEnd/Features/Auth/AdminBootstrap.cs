using System.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;

namespace BackEnd.Features.Auth;

public static class AdminBootstrap
{
    public static async Task RunAsync(IConfiguration config, CancellationToken ct = default)
    {
        var name = Environment.GetEnvironmentVariable("HRM_ADMIN_USERNAME")?.Trim();
        var password = Environment.GetEnvironmentVariable("HRM_ADMIN_PASSWORD");
        if (string.IsNullOrWhiteSpace(name) || name.Length > 256 || string.IsNullOrWhiteSpace(password) || password.Length < 12 || password.Length > 1024)
            throw new InvalidOperationException("Set HRM_ADMIN_USERNAME and HRM_ADMIN_PASSWORD (at least 12 characters).");
        var dummy = new AuthUser(0, name, "", true, 0, null);
        var hash = new PasswordHasher<AuthUser>().HashPassword(dummy, password);
        await using var connection = new SqlConnection(config.GetConnectionString("Hrm") ?? throw new InvalidOperationException("Configure ConnectionStrings:Hrm."));
        await connection.OpenAsync(ct);
        await using var transaction = (SqlTransaction)await connection.BeginTransactionAsync(IsolationLevel.Serializable, ct);
        await using var command = new SqlCommand(@"IF EXISTS (SELECT 1 FROM dbo.AppUser WITH (UPDLOCK, HOLDLOCK))
    THROW 50002, 'Bootstrap is only allowed when there are no users.', 1;
IF NOT EXISTS (SELECT 1 FROM dbo.AppRole WHERE Name = N'Admin')
    THROW 50003, 'Admin role is missing.', 1;
INSERT dbo.AppUser (UserName, NormalizedUserName, PasswordHash) VALUES (@name, @normalized, @hash);
INSERT dbo.AppUserRole (UserId, RoleId) SELECT CONVERT(BIGINT, SCOPE_IDENTITY()), Id FROM dbo.AppRole WHERE Name = N'Admin';", connection, transaction);
        command.Parameters.Add("@name", SqlDbType.NVarChar, 256).Value = name;
        command.Parameters.Add("@normalized", SqlDbType.NVarChar, 256).Value = name.ToUpperInvariant();
        command.Parameters.Add("@hash", SqlDbType.NVarChar, -1).Value = hash;
        await command.ExecuteNonQueryAsync(ct);
        await transaction.CommitAsync(ct);
        Console.WriteLine("Initial administrator created.");
    }
}
