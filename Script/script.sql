-- Authentication stored procedures for SQL Server.
-- Run after the HRM schema has been created, using SSMS or sqlcmd.
USE [HRM_2026];
GO

-- Look up account credentials and lockout state by normalized login name.
CREATE OR ALTER PROCEDURE dbo.Auth_FindUserByNormalizedName
    @NormalizedUserName NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, UserName, PasswordHash, IsActive, FailedLoginCount, LockoutEndUtc
    FROM dbo.AppUser
    WHERE NormalizedUserName = @NormalizedUserName;
END;
GO

-- Count failed logins and temporarily lock the account after five failures.
CREATE OR ALTER PROCEDURE dbo.Auth_RecordLoginFailure
    @UserId BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.AppUser
    SET FailedLoginCount = CASE WHEN FailedLoginCount + 1 >= 5 THEN 0 ELSE FailedLoginCount + 1 END,
        LockoutEndUtc = CASE WHEN FailedLoginCount + 1 >= 5
            THEN DATEADD(minute, 15, SYSUTCDATETIME()) ELSE LockoutEndUtc END
    WHERE Id = @UserId;
END;
GO

-- Reset the failure counter and create the revocable session in one transaction.
CREATE OR ALTER PROCEDURE dbo.Auth_CreateSession
    @UserId BIGINT,
    @SessionId UNIQUEIDENTIFIER,
    @ExpiresAtUtc DATETIME2
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        UPDATE dbo.AppUser
        SET FailedLoginCount = 0, LockoutEndUtc = NULL
        WHERE Id = @UserId;

        INSERT dbo.AuthSession (Id, UserId, ExpiresAtUtc)
        VALUES (@SessionId, @UserId, @ExpiresAtUtc);
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;
GO

-- A valid session with no roles returns one NULL row; no rows means an invalid session.
-- Return current roles only when the session and account are still valid.
CREATE OR ALTER PROCEDURE dbo.Auth_GetSessionRoles
    @UserId BIGINT,
    @SessionId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT r.Name
    FROM dbo.AuthSession s
    JOIN dbo.AppUser u ON u.Id = s.UserId
    LEFT JOIN dbo.AppUserRole ur ON ur.UserId = u.Id
    LEFT JOIN dbo.AppRole r ON r.Id = ur.RoleId
    WHERE s.Id = @SessionId
      AND s.UserId = @UserId
      AND s.RevokedAtUtc IS NULL
      AND s.ExpiresAtUtc > SYSUTCDATETIME()
      AND u.IsActive = 1;
END;
GO

-- Revoke a specific user session without removing its audit record.
CREATE OR ALTER PROCEDURE dbo.Auth_RevokeSession
    @UserId BIGINT,
    @SessionId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.AuthSession
    SET RevokedAtUtc = SYSUTCDATETIME()
    WHERE Id = @SessionId AND UserId = @UserId AND RevokedAtUtc IS NULL;
END;
GO

-- New accounts have no roles; role assignment is performed separately.
-- Check the normalized name under a transaction and insert an account without roles.
CREATE OR ALTER PROCEDURE dbo.Auth_RegisterUser
    @UserName NVARCHAR(MAX),
    @NormalizedUserName NVARCHAR(MAX),
    @PasswordHash NVARCHAR(MAX),
    @Created BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET @Created = 0;
    BEGIN TRY
        BEGIN TRANSACTION;
        IF NOT EXISTS (
            SELECT 1 FROM dbo.AppUser WITH (UPDLOCK, HOLDLOCK)
            WHERE NormalizedUserName = @NormalizedUserName
        )
        BEGIN
            INSERT dbo.AppUser (UserName, NormalizedUserName, PasswordHash)
            VALUES (@UserName, @NormalizedUserName, @PasswordHash);
            SET @Created = 1;
        END;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;
GO
