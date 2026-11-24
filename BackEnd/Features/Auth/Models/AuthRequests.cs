namespace BackEnd.Features.Auth;

// Request fields are nullable so the services can reject missing or empty credentials.
public sealed record LoginRequest(string? UserName, string? Password);
public sealed record RegisterRequest(string? UserName, string? Password);
