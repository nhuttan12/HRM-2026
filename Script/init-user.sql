/*
  DEVELOPMENT / LOCAL TEST DATA ONLY - DO NOT USE IN PRODUCTION.
  Default password for every new account: HrmDev@2026!
  PasswordHash values use ASP.NET Core Identity V3 PBKDF2 with independent salts.
  Existing accounts, passwords, role assignments, and sessions are never changed.
  Run after create-hrm-database.sql; requires the standard roles to exist.
*/
USE [HRM_2026];
GO
SET NOCOUNT ON;
SET XACT_ABORT ON;

DECLARE @Users TABLE (
    UserName NVARCHAR(256) NOT NULL,
    NormalizedUserName NVARCHAR(256) NOT NULL PRIMARY KEY,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    RoleName NVARCHAR(100) NOT NULL
);
INSERT INTO @Users (UserName, NormalizedUserName, PasswordHash, RoleName) VALUES
    (N'admin', N'ADMIN', N'AQAAAAIAAYagAAAAEDdx8tgazPGhtel/LoeDs7WdQUpDDopRxuwHNeFhFGnEv/vHvvUhmv/dMYizMGoIyw==', N'Admin'),
    (N'hr01', N'HR01', N'AQAAAAIAAYagAAAAEAWyf8ktGPFNsjc9RYe1gIuy52qAOiALwdtp6d8rCL7ZUktk6kWlap4ox/lWuWyxOg==', N'HR'),
    (N'hr02', N'HR02', N'AQAAAAIAAYagAAAAEPODUlkXonCKzA/ytfvROyRvyBG2n1Ol6AcxMliOBUO0AGIHefVb1rNazdeGYU/FwQ==', N'HR'),
    (N'hrlead', N'HRLEAD', N'AQAAAAIAAYagAAAAEKNZuvnPYPcVld94QuWDP95pX5GK16KuAjTj6wugzL9owKvrQCAv6hTta/gB0p1Y4g==', N'HRLead'),
    (N'manager01', N'MANAGER01', N'AQAAAAIAAYagAAAAEMIdeWDkY2XV0t1DT+VLglYelOdnT1QZuzGMqIlk0X8jMXnPSBwZZ1FUs64czMSw6w==', N'HiringManager');

DECLARE @Created TABLE (Id BIGINT NOT NULL, NormalizedUserName NVARCHAR(256) NOT NULL);
BEGIN TRY
    BEGIN TRANSACTION;

    IF EXISTS (SELECT 1 FROM @Users u WHERE NOT EXISTS (SELECT 1 FROM dbo.AppRole r WHERE r.Name = u.RoleName))
        THROW 50010, 'Required roles are missing. Run create-hrm-database.sql first.', 1;

    INSERT INTO dbo.AppUser (UserName, NormalizedUserName, PasswordHash)
    OUTPUT inserted.Id, inserted.NormalizedUserName INTO @Created (Id, NormalizedUserName)
    SELECT u.UserName, u.NormalizedUserName, u.PasswordHash
    FROM @Users u
    WHERE NOT EXISTS (
        SELECT 1 FROM dbo.AppUser existing WITH (UPDLOCK, HOLDLOCK)
        WHERE existing.NormalizedUserName = u.NormalizedUserName
    );

    INSERT INTO dbo.AppUserRole (UserId, RoleId)
    SELECT c.Id, r.Id
    FROM @Created c
    JOIN @Users u ON u.NormalizedUserName = c.NormalizedUserName
    JOIN dbo.AppRole r ON r.Name = u.RoleName;

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
GO
