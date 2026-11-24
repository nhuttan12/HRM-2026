namespace BackEnd.Features.Auth;

public static class AuthOptions
{
    public const string CookieName = "__Host-hrm_access";

    // Keep the access token inaccessible to JavaScript and require HTTPS and same-site requests.
    public static CookieOptions CookieOptions() => new()
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Path = "/",
        IsEssential = true
    };
}
