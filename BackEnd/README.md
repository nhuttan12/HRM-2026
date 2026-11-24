# HRM backend

The backend uses SQL Server as the source of truth. SQL changes are versioned in `../Script/`; EF models are generated from the installed schema. The authentication implementation is a work in progress and requires integration and security testing before deployment.

The schema includes permission definitions, role-permission grants, and assignments of users to candidates and recruitment batches. Assignment records do not grant access on their own. The current API authorization policies still use hard-coded role names and do not yet enforce these permission grants or assignment scopes; do not rely on the new tables for access control until the API is updated and tested. Permission definitions are seeded without granting them to any role.

## Setup

1. Run `../Script/create-hrm-database.sql` to create missing recruitment and authentication tables. Existing tables are not altered; use a versioned SQL migration for changes to existing table schemas.
2. Restore packages: `dotnet restore`. EF tooling version 10.0.12 is required for the command below.
3. Store environment-specific settings with User Secrets (replace placeholders locally; do not commit secrets):

```powershell
dotnet user-secrets set "ConnectionStrings:Hrm" "Server=localhost\SQLEXPRESS;Database=HRM_2026;Trusted_Connection=True;TrustServerCertificate=True"
dotnet user-secrets set "Authentication:Issuer" "hrm-api"
dotnet user-secrets set "Authentication:Audience" "hrm-client"
dotnet user-secrets set "Authentication:SigningKey" "<random secret of at least 32 UTF-8 bytes>"
dotnet user-secrets set "Cors:AllowedOrigins:0" "http://localhost:4200"
```

Generate the signing key securely; use a secrets manager outside development. Use HTTPS for the API because the cookies are Secure. The origin must match the Angular origin exactly. `SameSite=Strict` requires the frontend and API to be same-site; cross-site deployment needs a deliberate cookie and CSRF design.

4. Set `HRM_CONNECTION_STRING` in the local `.env` file (copy `.env.example` if needed). The file is ignored by Git. Generate entity classes and context from the real database:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\scaffold.ps1
```

The script reads `.env` for scaffolding; the running API still reads its connection string from .NET configuration (such as User Secrets), configured in step 3. Scaffold only after applying the schema scripts. Generated files may be overwritten on regeneration; do not edit them directly. Review the diff before using `--force`. The generated context is not yet registered or used by application features.

5. Create the initial administrator only on an empty user database. Set `HRM_ADMIN_USERNAME` and `HRM_ADMIN_PASSWORD` as environment variables, then run `dotnet run -- bootstrap-admin`; clear the password from the environment afterwards. No initial password is shipped.

## Authentication flow

- `GET /api/auth/csrf` returns a request token and sets an antiforgery cookie. Send credentials with cookies enabled.
- Send the token in `X-CSRF-TOKEN` when calling `POST /api/auth/login` with `{ "userName": "...", "password": "..." }`. A successful login sets a Secure, HttpOnly, SameSite=Strict JWT cookie. Fetch a new CSRF token after signing in.
- `GET /api/auth/me` returns the current user and roles. `POST /api/auth/logout` revokes the server-side session and deletes the cookie; send the CSRF header. Fetch another CSRF token after logout.
- JWT expires after 30 minutes; there is no refresh-token flow. The database session and current roles are checked on every authenticated request.

Use `StoredProcedureExecutor` through dependency injection for parameterized stored procedures. Its query method maps the first result set and exposes output parameter values after the reader closes. It does not currently support shared transactions or multiple result sets.
