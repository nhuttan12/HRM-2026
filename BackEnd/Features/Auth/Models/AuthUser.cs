namespace BackEnd.Features.Auth;

// Authentication data read from the database; this is not returned in API responses.
public sealed record AuthUser(
    long Id,
    string UserName,
    string PasswordHash,
    bool IsActive,
    int FailedLoginCount,
    DateTime? LockoutEndUtc);
