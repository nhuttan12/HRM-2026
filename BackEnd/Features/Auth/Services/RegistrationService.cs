using System.Data;
using BackEnd.Common.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;

namespace BackEnd.Features.Auth;

public enum RegistrationStatus { Success, InvalidInput, UserNameExists }

// Validates registration input and creates an account through a stored procedure.
public sealed class RegistrationService(
    IStoredProcedureExecutor procedures,
    IPasswordHasher<AuthUser> hasher)
{
    public async Task<RegistrationStatus> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken)
    {
        // Only empty or whitespace-only credentials are rejected at this stage.
        if (string.IsNullOrWhiteSpace(request.UserName) || string.IsNullOrWhiteSpace(request.Password))
        {
            return RegistrationStatus.InvalidInput;
        }

        // Store an Identity password hash rather than the submitted plaintext password.
        var name = request.UserName.Trim();
        var user = new AuthUser(0, name, "", true, 0, null);
        var passwordHash = hasher.HashPassword(user, request.Password);
        var created = new SqlParameter("@Created", SqlDbType.Bit) { Direction = ParameterDirection.Output };

        // The procedure checks username uniqueness and reports whether the account was created.
        await procedures.ExecuteAsync(
            "dbo.Auth_RegisterUser",
            [
                new SqlParameter("@UserName", SqlDbType.NVarChar, -1) { Value = name },
                new SqlParameter("@NormalizedUserName", SqlDbType.NVarChar, -1) { Value = name.ToUpperInvariant() },
                new SqlParameter("@PasswordHash", SqlDbType.NVarChar, -1) { Value = passwordHash },
                created
            ],
            cancellationToken);

        return created.Value is true ? RegistrationStatus.Success : RegistrationStatus.UserNameExists;
    }
}
