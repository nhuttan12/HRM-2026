/*
  HRM database - SQL Server
  Run in SSMS or sqlcmd (GO batch separator required).
  Creates HRM_2026 and missing tables and indexes. Existing tables are not altered;
  use a separate migration for schema changes to existing tables.
  Source: hrm-database.drawio. ? means nullable; BIGINT Id columns are IDENTITY.
*/
USE [master];
GO
IF DB_ID(N'HRM_2026') IS NULL
    CREATE DATABASE [HRM_2026];
GO
USE [HRM_2026];
GO
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRY
    BEGIN TRANSACTION;

    -- Stores the candidate profile.
    IF OBJECT_ID(N'dbo.Candidate', N'U') IS NULL
    CREATE TABLE dbo.Candidate (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Candidate PRIMARY KEY, -- Auto-incrementing primary key.
        CandidateCode NVARCHAR(255) NOT NULL CONSTRAINT UQ_Candidate_CandidateCode UNIQUE, -- Unique candidate code.
        FullName NVARCHAR(255) NOT NULL, -- Full name.
        Email NVARCHAR(255) NOT NULL, -- Candidate email address.
        Phone NVARCHAR(255) NOT NULL, -- Candidate phone number.
        Position NVARCHAR(255) NOT NULL, -- Applied or recruiting position.
        ApplicationDate DATE NOT NULL, -- Application date.
        DateOfBirth DATE NULL, -- Date of birth.
        Gender NVARCHAR(255) NULL, -- Gender.
        Address NVARCHAR(MAX) NULL, -- Address.
        EducationLevel NVARCHAR(255) NOT NULL, -- Education level.
        ExperienceYears DECIMAL(9,2) NULL, -- Years of experience.
        CurrentCompany NVARCHAR(255) NULL, -- Current employer.
        ExpectedSalary DECIMAL(18,2) NULL, -- Expected salary.
        NoticePeriod NVARCHAR(255) NULL, -- Notice period before starting work.
        CvUrl NVARCHAR(2048) NULL, -- URL of the candidate CV.
        Note NVARCHAR(MAX) NULL -- Additional notes.
    );

    -- Stores candidate skills and related experience.
    IF OBJECT_ID(N'dbo.CandidateSkill', N'U') IS NULL
    CREATE TABLE dbo.CandidateSkill (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_CandidateSkill PRIMARY KEY, -- Auto-incrementing primary key.
        CandidateId BIGINT NOT NULL, -- Foreign key to the candidate.
        Skill NVARCHAR(255) NOT NULL, -- Skill name.
        YearsOfExperience DECIMAL(9,2) NOT NULL, -- Years of experience with the skill.
        CompanyName NVARCHAR(255) NOT NULL, -- Name of the associated company.
        CONSTRAINT FK_CandidateSkill_Candidate FOREIGN KEY (CandidateId) REFERENCES dbo.Candidate(Id)
    );

    -- Stores the candidate employment history.
    IF OBJECT_ID(N'dbo.CandidateWorkHistory', N'U') IS NULL
    CREATE TABLE dbo.CandidateWorkHistory (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_CandidateWorkHistory PRIMARY KEY, -- Auto-incrementing primary key.
        CandidateId BIGINT NOT NULL, -- Foreign key to the candidate.
        JobTitle NVARCHAR(255) NOT NULL, -- Job title.
        CompanyName NVARCHAR(255) NOT NULL, -- Name of the associated company.
        StartDate DATE NOT NULL, -- Start date.
        EndDate DATE NULL, -- End date.
        Description NVARCHAR(MAX) NULL, -- Job description.
        CONSTRAINT FK_CandidateWorkHistory_Candidate FOREIGN KEY (CandidateId) REFERENCES dbo.Candidate(Id)
    );

    -- Stores candidate education and degree information.
    IF OBJECT_ID(N'dbo.CandidateDegree', N'U') IS NULL
    CREATE TABLE dbo.CandidateDegree (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_CandidateDegree PRIMARY KEY, -- Auto-incrementing primary key.
        CandidateId BIGINT NOT NULL, -- Foreign key to the candidate.
        SchoolName NVARCHAR(255) NOT NULL, -- Name of the educational institution.
        GraduationType NVARCHAR(255) NOT NULL, -- Degree or graduation classification.
        StudyYear INT NULL, -- Year of study.
        GraduationYear INT NULL, -- Graduation year.
        Major NVARCHAR(255) NULL, -- Field of study.
        CONSTRAINT FK_CandidateDegree_Candidate FOREIGN KEY (CandidateId) REFERENCES dbo.Candidate(Id)
    );

    -- Stores candidate certificates.
    IF OBJECT_ID(N'dbo.CandidateCertificate', N'U') IS NULL
    CREATE TABLE dbo.CandidateCertificate (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_CandidateCertificate PRIMARY KEY, -- Auto-incrementing primary key.
        CandidateId BIGINT NOT NULL, -- Foreign key to the candidate.
        CertificateName NVARCHAR(255) NOT NULL, -- Certificate name.
        CertificateType NVARCHAR(255) NOT NULL, -- Certificate type.
        IssueDate DATE NOT NULL, -- Certificate issue date.
        ExpiryDate DATE NULL, -- Certificate expiration date.
        IssuingOrganization NVARCHAR(255) NULL, -- Certificate issuing organization.
        CONSTRAINT FK_CandidateCertificate_Candidate FOREIGN KEY (CandidateId) REFERENCES dbo.Candidate(Id)
    );

    -- Stores information about candidate relatives.
    IF OBJECT_ID(N'dbo.CandidateRelative', N'U') IS NULL
    CREATE TABLE dbo.CandidateRelative (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_CandidateRelative PRIMARY KEY, -- Auto-incrementing primary key.
        CandidateId BIGINT NOT NULL, -- Foreign key to the candidate.
        FullName NVARCHAR(255) NOT NULL, -- Relative full name.
        Relationship NVARCHAR(255) NOT NULL, -- Relationship to the candidate.
        BirthYear INT NULL, -- Year of birth.
        CurrentOccupation NVARCHAR(255) NULL, -- Current occupation.
        CONSTRAINT FK_CandidateRelative_Candidate FOREIGN KEY (CandidateId) REFERENCES dbo.Candidate(Id)
    );

    -- Stores social links; each candidate has at most one record.
    IF OBJECT_ID(N'dbo.CandidateSocialLink', N'U') IS NULL
    CREATE TABLE dbo.CandidateSocialLink (
        CandidateId BIGINT NOT NULL CONSTRAINT PK_CandidateSocialLink PRIMARY KEY, -- Primary key and foreign key to the candidate.
        Facebook NVARCHAR(2048) NULL, -- Facebook URL.
        Linkedin NVARCHAR(2048) NULL, -- LinkedIn URL.
        Github NVARCHAR(2048) NULL, -- GitHub URL.
        Portfolio NVARCHAR(2048) NULL, -- Portfolio URL.
        CONSTRAINT FK_CandidateSocialLink_Candidate FOREIGN KEY (CandidateId) REFERENCES dbo.Candidate(Id)
    );

    -- Stores recruitment proposals that may produce multiple recruitment batches.
    IF OBJECT_ID(N'dbo.RecruitmentProposal', N'U') IS NULL
    CREATE TABLE dbo.RecruitmentProposal (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_RecruitmentProposal PRIMARY KEY, -- Auto-incrementing primary key.
        Code NVARCHAR(255) NOT NULL CONSTRAINT UQ_RecruitmentProposal_Code UNIQUE, -- Unique proposal code.
        Name NVARCHAR(255) NOT NULL, -- Recruitment proposal name.
        Position NVARCHAR(255) NOT NULL, -- Applied or recruiting position.
        Quantity INT NOT NULL, -- Number of positions to fill.
        StartDate DATE NOT NULL, -- Start date.
        EndDate DATE NOT NULL, -- End date.
        Status NVARCHAR(255) NOT NULL, -- Proposal approval status.
        ExperienceYears DECIMAL(9,2) NULL, -- Years of experience.
        ProposalDate DATE NULL, -- Proposal date.
        ApprovedBy NVARCHAR(255) NULL -- Person who approved the proposal or batch.
    );

    -- Stores recruitment batches opened directly or created from proposals.
    IF OBJECT_ID(N'dbo.RecruitmentBatch', N'U') IS NULL
    CREATE TABLE dbo.RecruitmentBatch (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_RecruitmentBatch PRIMARY KEY, -- Auto-incrementing primary key.
        Code NVARCHAR(255) NOT NULL CONSTRAINT UQ_RecruitmentBatch_Code UNIQUE, -- Unique recruitment batch code.
        Name NVARCHAR(255) NOT NULL, -- Recruitment batch name.
        Position NVARCHAR(255) NOT NULL, -- Applied or recruiting position.
        Quantity INT NOT NULL, -- Number of positions to fill.
        StartDate DATE NOT NULL, -- Start date.
        EndDate DATE NOT NULL, -- End date.
        Status NVARCHAR(255) NOT NULL, -- Recruitment batch status.
        ExperienceYears DECIMAL(9,2) NULL, -- Years of experience.
        ProposalDate DATE NULL, -- Proposal date.
        ApprovedBy NVARCHAR(255) NULL, -- Person who approved the proposal or batch.
        OpenedBy NVARCHAR(255) NULL, -- Person who opened the batch.
        OpenedDate DATE NULL, -- Date the batch was opened.
        ApprovedDate DATE NULL, -- Approval date.
        ClosedDate DATE NULL, -- Date the batch was closed.
        CreatedBy NVARCHAR(255) NULL, -- Person who created the record.
        UpdatedBy NVARCHAR(255) NULL, -- Person who last updated the record.
        HiringManager NVARCHAR(255) NULL, -- Hiring manager.
        HrOwner NVARCHAR(255) NULL, -- HR person responsible for recruitment.
        Department NVARCHAR(255) NULL, -- Recruiting department.
        Location NVARCHAR(255) NULL, -- Recruitment location.
        SalaryRange NVARCHAR(255) NULL, -- Expected salary range.
        Priority NVARCHAR(255) NULL, -- Priority level.
        Note NVARCHAR(MAX) NULL, -- Additional notes.
        ProposalId BIGINT NULL, -- Foreign key to the proposal; null for a directly opened batch.
        CONSTRAINT FK_RecruitmentBatch_RecruitmentProposal FOREIGN KEY (ProposalId) REFERENCES dbo.RecruitmentProposal(Id)
    );

    -- Stores skill requirements for a recruitment batch.
    IF OBJECT_ID(N'dbo.BatchSkillRequirement', N'U') IS NULL
    CREATE TABLE dbo.BatchSkillRequirement (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_BatchSkillRequirement PRIMARY KEY, -- Auto-incrementing primary key.
        BatchId BIGINT NOT NULL, -- Foreign key to the recruitment batch.
        Skill NVARCHAR(255) NOT NULL, -- Skill name.
        YearsOfExperience DECIMAL(9,2) NOT NULL, -- Years of experience with the skill.
        CompanyName NVARCHAR(255) NOT NULL, -- Name of the associated company.
        CONSTRAINT FK_BatchSkillRequirement_RecruitmentBatch FOREIGN KEY (BatchId) REFERENCES dbo.RecruitmentBatch(Id)
    );

    -- Stores degree requirements for a recruitment batch.
    IF OBJECT_ID(N'dbo.BatchDegreeRequirement', N'U') IS NULL
    CREATE TABLE dbo.BatchDegreeRequirement (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_BatchDegreeRequirement PRIMARY KEY, -- Auto-incrementing primary key.
        BatchId BIGINT NOT NULL, -- Foreign key to the recruitment batch.
        SchoolName NVARCHAR(255) NOT NULL, -- Name of the educational institution.
        GraduationType NVARCHAR(255) NOT NULL, -- Degree or graduation classification.
        StudyYear INT NULL, -- Year of study.
        GraduationYear INT NULL, -- Graduation year.
        Major NVARCHAR(255) NULL, -- Field of study.
        CONSTRAINT FK_BatchDegreeRequirement_RecruitmentBatch FOREIGN KEY (BatchId) REFERENCES dbo.RecruitmentBatch(Id)
    );

    -- Stores certificate requirements for a recruitment batch.
    IF OBJECT_ID(N'dbo.BatchCertificateRequirement', N'U') IS NULL
    CREATE TABLE dbo.BatchCertificateRequirement (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_BatchCertificateRequirement PRIMARY KEY, -- Auto-incrementing primary key.
        BatchId BIGINT NOT NULL, -- Foreign key to the recruitment batch.
        CertificateName NVARCHAR(255) NOT NULL, -- Certificate name.
        CertificateType NVARCHAR(255) NOT NULL, -- Certificate type.
        IssueDate DATE NOT NULL, -- Certificate issue date.
        ExpiryDate DATE NULL, -- Certificate expiration date.
        IssuingOrganization NVARCHAR(255) NULL, -- Certificate issuing organization.
        CONSTRAINT FK_BatchCertificateRequirement_RecruitmentBatch FOREIGN KEY (BatchId) REFERENCES dbo.RecruitmentBatch(Id)
    );

    -- Lists recruitment tracking stages.
    IF OBJECT_ID(N'dbo.TrackingStage', N'U') IS NULL
    CREATE TABLE dbo.TrackingStage (
        Code NVARCHAR(255) NOT NULL CONSTRAINT PK_TrackingStage PRIMARY KEY, -- Stage code and primary key.
        Label NVARCHAR(255) NOT NULL -- Display name of the stage.
    );

    -- Links a candidate to a recruitment batch and current stage.
    IF OBJECT_ID(N'dbo.BatchCandidate', N'U') IS NULL
    CREATE TABLE dbo.BatchCandidate (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_BatchCandidate PRIMARY KEY, -- Auto-incrementing primary key.
        BatchId BIGINT NOT NULL, -- Foreign key to the recruitment batch.
        CandidateId BIGINT NOT NULL, -- Foreign key to the candidate.
        StageCode NVARCHAR(255) NOT NULL, -- Foreign key to the current recruitment stage.
        RecruitmentStatus NVARCHAR(255) NOT NULL, -- Candidate recruitment status within the batch.
        CONSTRAINT FK_BatchCandidate_RecruitmentBatch FOREIGN KEY (BatchId) REFERENCES dbo.RecruitmentBatch(Id),
        CONSTRAINT FK_BatchCandidate_Candidate FOREIGN KEY (CandidateId) REFERENCES dbo.Candidate(Id),
        CONSTRAINT FK_BatchCandidate_TrackingStage FOREIGN KEY (StageCode) REFERENCES dbo.TrackingStage(Code),
        CONSTRAINT UQ_BatchCandidate_BatchId_CandidateId UNIQUE (BatchId, CandidateId)
    );

    -- Stores interview rounds for a candidate in a recruitment batch.
    IF OBJECT_ID(N'dbo.InterviewRound', N'U') IS NULL
    CREATE TABLE dbo.InterviewRound (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_InterviewRound PRIMARY KEY, -- Auto-incrementing primary key.
        BatchCandidateId BIGINT NOT NULL, -- Foreign key to the candidate application within the batch.
        RoundCode NVARCHAR(255) NOT NULL, -- Interview round code.
        Name NVARCHAR(255) NOT NULL, -- Interview round name.
        Interviewer NVARCHAR(255) NOT NULL, -- Interviewer.
        InterviewDate DATETIME2(0) NULL, -- Interview date and time.
        Status NVARCHAR(255) NOT NULL, -- Interview round status.
        CONSTRAINT FK_InterviewRound_BatchCandidate FOREIGN KEY (BatchCandidateId) REFERENCES dbo.BatchCandidate(Id)
    );

    -- Stores application accounts and login lockout information.
    IF OBJECT_ID(N'dbo.AppUser', N'U') IS NULL
    CREATE TABLE dbo.AppUser (
        Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_AppUser PRIMARY KEY, -- Auto-incrementing user identifier.
        UserName NVARCHAR(256) NOT NULL, -- Display name used to sign in.
        NormalizedUserName NVARCHAR(256) NOT NULL CONSTRAINT UQ_AppUser_NormalizedUserName UNIQUE, -- Normalized unique login name.
        PasswordHash NVARCHAR(MAX) NOT NULL, -- Password hash; never stores the plaintext password.
        IsActive BIT NOT NULL CONSTRAINT DF_AppUser_IsActive DEFAULT 1, -- Whether the account can sign in.
        FailedLoginCount INT NOT NULL CONSTRAINT DF_AppUser_FailedLoginCount DEFAULT 0, -- Consecutive unsuccessful sign-in attempts.
        LockoutEndUtc DATETIME2 NULL -- UTC time when a temporary lockout ends.
    );

    -- Stores roles that can be assigned to application users.
    IF OBJECT_ID(N'dbo.AppRole', N'U') IS NULL
    CREATE TABLE dbo.AppRole (
        Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_AppRole PRIMARY KEY, -- Auto-incrementing role identifier.
        Name NVARCHAR(100) NOT NULL CONSTRAINT UQ_AppRole_Name UNIQUE -- Unique role name.
    );

    -- Associates users with their assigned roles.
    IF OBJECT_ID(N'dbo.AppUserRole', N'U') IS NULL
    CREATE TABLE dbo.AppUserRole (
        UserId BIGINT NOT NULL, -- Foreign key to the application user.
        RoleId INT NOT NULL, -- Foreign key to the assigned role.
        CONSTRAINT PK_AppUserRole PRIMARY KEY (UserId, RoleId),
        CONSTRAINT FK_AppUserRole_AppUser FOREIGN KEY (UserId) REFERENCES dbo.AppUser(Id),
        CONSTRAINT FK_AppUserRole_AppRole FOREIGN KEY (RoleId) REFERENCES dbo.AppRole(Id)
    );

    -- Tracks authentication sessions and revocation.
    IF OBJECT_ID(N'dbo.AuthSession', N'U') IS NULL
    CREATE TABLE dbo.AuthSession (
        Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_AuthSession PRIMARY KEY, -- Unique session identifier.
        UserId BIGINT NOT NULL, -- Foreign key to the application user.
        ExpiresAtUtc DATETIME2 NOT NULL, -- Session expiration time in UTC.
        RevokedAtUtc DATETIME2 NULL, -- UTC revocation time, if revoked.
        CONSTRAINT FK_AuthSession_AppUser FOREIGN KEY (UserId) REFERENCES dbo.AppUser(Id)
    );

    -- Defines individual capabilities independently of role names.
    IF OBJECT_ID(N'dbo.AppPermission', N'U') IS NULL
    CREATE TABLE dbo.AppPermission (
        Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_AppPermission PRIMARY KEY, -- Auto-incrementing permission identifier.
        Code NVARCHAR(150) NOT NULL CONSTRAINT UQ_AppPermission_Code UNIQUE, -- Stable permission code used by the application.
        Description NVARCHAR(500) NULL -- Human-readable description of the permission.
    );

    -- Grants permissions to roles; no permissions are granted implicitly.
    IF OBJECT_ID(N'dbo.AppRolePermission', N'U') IS NULL
    CREATE TABLE dbo.AppRolePermission (
        RoleId INT NOT NULL, -- Foreign key to the role.
        PermissionId INT NOT NULL, -- Foreign key to the permission.
        CONSTRAINT PK_AppRolePermission PRIMARY KEY (RoleId, PermissionId),
        CONSTRAINT FK_AppRolePermission_AppRole FOREIGN KEY (RoleId) REFERENCES dbo.AppRole(Id),
        CONSTRAINT FK_AppRolePermission_AppPermission FOREIGN KEY (PermissionId) REFERENCES dbo.AppPermission(Id)
    );

    -- Records users assigned to manage a candidate; this is not itself a permission grant.
    IF OBJECT_ID(N'dbo.CandidateAssignment', N'U') IS NULL
    CREATE TABLE dbo.CandidateAssignment (
        CandidateId BIGINT NOT NULL, -- Foreign key to the candidate.
        UserId BIGINT NOT NULL, -- Foreign key to the assigned user.
        AssignedAtUtc DATETIME2 NOT NULL CONSTRAINT DF_CandidateAssignment_AssignedAtUtc DEFAULT SYSUTCDATETIME(), -- Assignment time in UTC.
        CONSTRAINT PK_CandidateAssignment PRIMARY KEY (CandidateId, UserId),
        CONSTRAINT FK_CandidateAssignment_Candidate FOREIGN KEY (CandidateId) REFERENCES dbo.Candidate(Id),
        CONSTRAINT FK_CandidateAssignment_AppUser FOREIGN KEY (UserId) REFERENCES dbo.AppUser(Id)
    );

    -- Records users assigned to manage a recruitment batch; this is not itself a permission grant.
    IF OBJECT_ID(N'dbo.RecruitmentBatchAssignment', N'U') IS NULL
    CREATE TABLE dbo.RecruitmentBatchAssignment (
        BatchId BIGINT NOT NULL, -- Foreign key to the recruitment batch.
        UserId BIGINT NOT NULL, -- Foreign key to the assigned user.
        AssignedAtUtc DATETIME2 NOT NULL CONSTRAINT DF_RecruitmentBatchAssignment_AssignedAtUtc DEFAULT SYSUTCDATETIME(), -- Assignment time in UTC.
        CONSTRAINT PK_RecruitmentBatchAssignment PRIMARY KEY (BatchId, UserId),
        CONSTRAINT FK_RecruitmentBatchAssignment_RecruitmentBatch FOREIGN KEY (BatchId) REFERENCES dbo.RecruitmentBatch(Id),
        CONSTRAINT FK_RecruitmentBatchAssignment_AppUser FOREIGN KEY (UserId) REFERENCES dbo.AppUser(Id)
    );

    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.CandidateSkill') AND name = N'IX_CandidateSkill_CandidateId')
        CREATE INDEX IX_CandidateSkill_CandidateId ON dbo.CandidateSkill(CandidateId);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.CandidateWorkHistory') AND name = N'IX_CandidateWorkHistory_CandidateId')
        CREATE INDEX IX_CandidateWorkHistory_CandidateId ON dbo.CandidateWorkHistory(CandidateId);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.CandidateDegree') AND name = N'IX_CandidateDegree_CandidateId')
        CREATE INDEX IX_CandidateDegree_CandidateId ON dbo.CandidateDegree(CandidateId);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.CandidateCertificate') AND name = N'IX_CandidateCertificate_CandidateId')
        CREATE INDEX IX_CandidateCertificate_CandidateId ON dbo.CandidateCertificate(CandidateId);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.CandidateRelative') AND name = N'IX_CandidateRelative_CandidateId')
        CREATE INDEX IX_CandidateRelative_CandidateId ON dbo.CandidateRelative(CandidateId);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.RecruitmentBatch') AND name = N'IX_RecruitmentBatch_ProposalId')
        CREATE INDEX IX_RecruitmentBatch_ProposalId ON dbo.RecruitmentBatch(ProposalId);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.BatchSkillRequirement') AND name = N'IX_BatchSkillRequirement_BatchId')
        CREATE INDEX IX_BatchSkillRequirement_BatchId ON dbo.BatchSkillRequirement(BatchId);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.BatchDegreeRequirement') AND name = N'IX_BatchDegreeRequirement_BatchId')
        CREATE INDEX IX_BatchDegreeRequirement_BatchId ON dbo.BatchDegreeRequirement(BatchId);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.BatchCertificateRequirement') AND name = N'IX_BatchCertificateRequirement_BatchId')
        CREATE INDEX IX_BatchCertificateRequirement_BatchId ON dbo.BatchCertificateRequirement(BatchId);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.BatchCandidate') AND name = N'IX_BatchCandidate_CandidateId')
        CREATE INDEX IX_BatchCandidate_CandidateId ON dbo.BatchCandidate(CandidateId);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.BatchCandidate') AND name = N'IX_BatchCandidate_StageCode')
        CREATE INDEX IX_BatchCandidate_StageCode ON dbo.BatchCandidate(StageCode);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.InterviewRound') AND name = N'IX_InterviewRound_BatchCandidateId')
        CREATE INDEX IX_InterviewRound_BatchCandidateId ON dbo.InterviewRound(BatchCandidateId);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.AuthSession') AND name = N'IX_AuthSession_UserId')
        CREATE INDEX IX_AuthSession_UserId ON dbo.AuthSession(UserId);

    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.AppUserRole') AND name = N'IX_AppUserRole_RoleId')
        CREATE INDEX IX_AppUserRole_RoleId ON dbo.AppUserRole(RoleId);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.AppRolePermission') AND name = N'IX_AppRolePermission_PermissionId')
        CREATE INDEX IX_AppRolePermission_PermissionId ON dbo.AppRolePermission(PermissionId);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.CandidateAssignment') AND name = N'IX_CandidateAssignment_UserId')
        CREATE INDEX IX_CandidateAssignment_UserId ON dbo.CandidateAssignment(UserId);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.RecruitmentBatchAssignment') AND name = N'IX_RecruitmentBatchAssignment_UserId')
        CREATE INDEX IX_RecruitmentBatchAssignment_UserId ON dbo.RecruitmentBatchAssignment(UserId);

    -- Initial stages use the codes and labels currently defined in the frontend.
    INSERT INTO dbo.TrackingStage (Code, Label)
    SELECT stages.Code, stages.Label
    FROM (VALUES (N'new', N'Mới'), (N'screening', N'Sàng lọc'),
                 (N'interview', N'Phỏng vấn'), (N'offer', N'Đề nghị'), (N'hired', N'Đã tuyển')) AS stages(Code, Label)
    WHERE NOT EXISTS (SELECT 1 FROM dbo.TrackingStage AS existing WHERE existing.Code = stages.Code);

    -- Initial roles used by the authorization policies.
    INSERT INTO dbo.AppRole (Name)
    SELECT roles.Name FROM (VALUES (N'Admin'), (N'HR'), (N'HRLead'), (N'HiringManager')) AS roles(Name)
    WHERE NOT EXISTS (SELECT 1 FROM dbo.AppRole AS existing WHERE existing.Name = roles.Name);

    -- Permission definitions only: grants are managed separately and never reset by this script.
    INSERT INTO dbo.AppPermission (Code, Description)
    SELECT permissions.Code, permissions.Description
    FROM (VALUES
        (N'Candidates.Read.Assigned', N'View candidates assigned to the user'),
        (N'Candidates.Read.All', N'View all candidates'),
        (N'Candidates.Write.Assigned', N'Update candidates assigned to the user'),
        (N'Candidates.Write.All', N'Update all candidates'),
        (N'Candidates.Create', N'Create candidate profiles'),
        (N'Candidates.Assign', N'Manage candidate assignments'),
        (N'RecruitmentBatches.Read.Assigned', N'View recruitment batches assigned to the user'),
        (N'RecruitmentBatches.Read.All', N'View all recruitment batches'),
        (N'RecruitmentBatches.Write.Assigned', N'Update recruitment batches assigned to the user'),
        (N'RecruitmentBatches.Write.All', N'Update all recruitment batches'),
        (N'RecruitmentBatches.Create', N'Create recruitment batches'),
        (N'RecruitmentBatches.Assign', N'Manage recruitment batch assignments'),
        (N'Users.Manage', N'Manage application users'),
        (N'Roles.Manage', N'Manage roles and permission grants')
    ) AS permissions(Code, Description)
    WHERE NOT EXISTS (SELECT 1 FROM dbo.AppPermission AS existing WHERE existing.Code = permissions.Code);

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
GO
