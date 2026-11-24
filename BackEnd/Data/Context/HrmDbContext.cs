using System;
using System.Collections.Generic;
using BackEnd.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Data.Context;

public partial class HrmDbContext : DbContext
{
    public HrmDbContext(DbContextOptions<HrmDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<BatchCandidate> BatchCandidates { get; set; }

    public virtual DbSet<BatchCertificateRequirement> BatchCertificateRequirements { get; set; }

    public virtual DbSet<BatchDegreeRequirement> BatchDegreeRequirements { get; set; }

    public virtual DbSet<BatchSkillRequirement> BatchSkillRequirements { get; set; }

    public virtual DbSet<Candidate> Candidates { get; set; }

    public virtual DbSet<CandidateCertificate> CandidateCertificates { get; set; }

    public virtual DbSet<CandidateDegree> CandidateDegrees { get; set; }

    public virtual DbSet<CandidateRelative> CandidateRelatives { get; set; }

    public virtual DbSet<CandidateSkill> CandidateSkills { get; set; }

    public virtual DbSet<CandidateSocialLink> CandidateSocialLinks { get; set; }

    public virtual DbSet<CandidateWorkHistory> CandidateWorkHistories { get; set; }

    public virtual DbSet<InterviewRound> InterviewRounds { get; set; }

    public virtual DbSet<RecruitmentBatch> RecruitmentBatches { get; set; }

    public virtual DbSet<RecruitmentProposal> RecruitmentProposals { get; set; }

    public virtual DbSet<TrackingStage> TrackingStages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BatchCandidate>(entity =>
        {
            entity.ToTable("BatchCandidate");

            entity.HasIndex(e => e.CandidateId, "IX_BatchCandidate_CandidateId");

            entity.HasIndex(e => e.StageCode, "IX_BatchCandidate_StageCode");

            entity.HasIndex(e => new { e.BatchId, e.CandidateId }, "UQ_BatchCandidate_BatchId_CandidateId").IsUnique();

            entity.Property(e => e.RecruitmentStatus).HasMaxLength(255);
            entity.Property(e => e.StageCode).HasMaxLength(255);

            entity.HasOne(d => d.Batch).WithMany(p => p.BatchCandidates)
                .HasForeignKey(d => d.BatchId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BatchCandidate_RecruitmentBatch");

            entity.HasOne(d => d.Candidate).WithMany(p => p.BatchCandidates)
                .HasForeignKey(d => d.CandidateId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BatchCandidate_Candidate");

            entity.HasOne(d => d.StageCodeNavigation).WithMany(p => p.BatchCandidates)
                .HasForeignKey(d => d.StageCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BatchCandidate_TrackingStage");
        });

        modelBuilder.Entity<BatchCertificateRequirement>(entity =>
        {
            entity.ToTable("BatchCertificateRequirement");

            entity.HasIndex(e => e.BatchId, "IX_BatchCertificateRequirement_BatchId");

            entity.Property(e => e.CertificateName).HasMaxLength(255);
            entity.Property(e => e.CertificateType).HasMaxLength(255);
            entity.Property(e => e.IssuingOrganization).HasMaxLength(255);

            entity.HasOne(d => d.Batch).WithMany(p => p.BatchCertificateRequirements)
                .HasForeignKey(d => d.BatchId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BatchCertificateRequirement_RecruitmentBatch");
        });

        modelBuilder.Entity<BatchDegreeRequirement>(entity =>
        {
            entity.ToTable("BatchDegreeRequirement");

            entity.HasIndex(e => e.BatchId, "IX_BatchDegreeRequirement_BatchId");

            entity.Property(e => e.GraduationType).HasMaxLength(255);
            entity.Property(e => e.Major).HasMaxLength(255);
            entity.Property(e => e.SchoolName).HasMaxLength(255);

            entity.HasOne(d => d.Batch).WithMany(p => p.BatchDegreeRequirements)
                .HasForeignKey(d => d.BatchId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BatchDegreeRequirement_RecruitmentBatch");
        });

        modelBuilder.Entity<BatchSkillRequirement>(entity =>
        {
            entity.ToTable("BatchSkillRequirement");

            entity.HasIndex(e => e.BatchId, "IX_BatchSkillRequirement_BatchId");

            entity.Property(e => e.CompanyName).HasMaxLength(255);
            entity.Property(e => e.Skill).HasMaxLength(255);
            entity.Property(e => e.YearsOfExperience).HasColumnType("decimal(9, 2)");

            entity.HasOne(d => d.Batch).WithMany(p => p.BatchSkillRequirements)
                .HasForeignKey(d => d.BatchId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BatchSkillRequirement_RecruitmentBatch");
        });

        modelBuilder.Entity<Candidate>(entity =>
        {
            entity.ToTable("Candidate");

            entity.HasIndex(e => e.CandidateCode, "UQ_Candidate_CandidateCode").IsUnique();

            entity.Property(e => e.CandidateCode).HasMaxLength(255);
            entity.Property(e => e.CurrentCompany).HasMaxLength(255);
            entity.Property(e => e.CvUrl).HasMaxLength(2048);
            entity.Property(e => e.EducationLevel).HasMaxLength(255);
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.ExpectedSalary).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ExperienceYears).HasColumnType("decimal(9, 2)");
            entity.Property(e => e.FullName).HasMaxLength(255);
            entity.Property(e => e.Gender).HasMaxLength(255);
            entity.Property(e => e.NoticePeriod).HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(255);
            entity.Property(e => e.Position).HasMaxLength(255);
        });

        modelBuilder.Entity<CandidateCertificate>(entity =>
        {
            entity.ToTable("CandidateCertificate");

            entity.HasIndex(e => e.CandidateId, "IX_CandidateCertificate_CandidateId");

            entity.Property(e => e.CertificateName).HasMaxLength(255);
            entity.Property(e => e.CertificateType).HasMaxLength(255);
            entity.Property(e => e.IssuingOrganization).HasMaxLength(255);

            entity.HasOne(d => d.Candidate).WithMany(p => p.CandidateCertificates)
                .HasForeignKey(d => d.CandidateId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CandidateCertificate_Candidate");
        });

        modelBuilder.Entity<CandidateDegree>(entity =>
        {
            entity.ToTable("CandidateDegree");

            entity.HasIndex(e => e.CandidateId, "IX_CandidateDegree_CandidateId");

            entity.Property(e => e.GraduationType).HasMaxLength(255);
            entity.Property(e => e.Major).HasMaxLength(255);
            entity.Property(e => e.SchoolName).HasMaxLength(255);

            entity.HasOne(d => d.Candidate).WithMany(p => p.CandidateDegrees)
                .HasForeignKey(d => d.CandidateId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CandidateDegree_Candidate");
        });

        modelBuilder.Entity<CandidateRelative>(entity =>
        {
            entity.ToTable("CandidateRelative");

            entity.HasIndex(e => e.CandidateId, "IX_CandidateRelative_CandidateId");

            entity.Property(e => e.CurrentOccupation).HasMaxLength(255);
            entity.Property(e => e.FullName).HasMaxLength(255);
            entity.Property(e => e.Relationship).HasMaxLength(255);

            entity.HasOne(d => d.Candidate).WithMany(p => p.CandidateRelatives)
                .HasForeignKey(d => d.CandidateId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CandidateRelative_Candidate");
        });

        modelBuilder.Entity<CandidateSkill>(entity =>
        {
            entity.ToTable("CandidateSkill");

            entity.HasIndex(e => e.CandidateId, "IX_CandidateSkill_CandidateId");

            entity.Property(e => e.CompanyName).HasMaxLength(255);
            entity.Property(e => e.Skill).HasMaxLength(255);
            entity.Property(e => e.YearsOfExperience).HasColumnType("decimal(9, 2)");

            entity.HasOne(d => d.Candidate).WithMany(p => p.CandidateSkills)
                .HasForeignKey(d => d.CandidateId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CandidateSkill_Candidate");
        });

        modelBuilder.Entity<CandidateSocialLink>(entity =>
        {
            entity.HasKey(e => e.CandidateId);

            entity.ToTable("CandidateSocialLink");

            entity.Property(e => e.CandidateId).ValueGeneratedNever();
            entity.Property(e => e.Facebook).HasMaxLength(2048);
            entity.Property(e => e.Github).HasMaxLength(2048);
            entity.Property(e => e.Linkedin).HasMaxLength(2048);
            entity.Property(e => e.Portfolio).HasMaxLength(2048);

            entity.HasOne(d => d.Candidate).WithOne(p => p.CandidateSocialLink)
                .HasForeignKey<CandidateSocialLink>(d => d.CandidateId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CandidateSocialLink_Candidate");
        });

        modelBuilder.Entity<CandidateWorkHistory>(entity =>
        {
            entity.ToTable("CandidateWorkHistory");

            entity.HasIndex(e => e.CandidateId, "IX_CandidateWorkHistory_CandidateId");

            entity.Property(e => e.CompanyName).HasMaxLength(255);
            entity.Property(e => e.JobTitle).HasMaxLength(255);

            entity.HasOne(d => d.Candidate).WithMany(p => p.CandidateWorkHistories)
                .HasForeignKey(d => d.CandidateId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CandidateWorkHistory_Candidate");
        });

        modelBuilder.Entity<InterviewRound>(entity =>
        {
            entity.ToTable("InterviewRound");

            entity.HasIndex(e => e.BatchCandidateId, "IX_InterviewRound_BatchCandidateId");

            entity.Property(e => e.InterviewDate).HasPrecision(0);
            entity.Property(e => e.Interviewer).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.RoundCode).HasMaxLength(255);
            entity.Property(e => e.Status).HasMaxLength(255);

            entity.HasOne(d => d.BatchCandidate).WithMany(p => p.InterviewRounds)
                .HasForeignKey(d => d.BatchCandidateId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_InterviewRound_BatchCandidate");
        });

        modelBuilder.Entity<RecruitmentBatch>(entity =>
        {
            entity.ToTable("RecruitmentBatch");

            entity.HasIndex(e => e.ProposalId, "IX_RecruitmentBatch_ProposalId");

            entity.HasIndex(e => e.Code, "UQ_RecruitmentBatch_Code").IsUnique();

            entity.Property(e => e.ApprovedBy).HasMaxLength(255);
            entity.Property(e => e.Code).HasMaxLength(255);
            entity.Property(e => e.CreatedBy).HasMaxLength(255);
            entity.Property(e => e.Department).HasMaxLength(255);
            entity.Property(e => e.ExperienceYears).HasColumnType("decimal(9, 2)");
            entity.Property(e => e.HiringManager).HasMaxLength(255);
            entity.Property(e => e.HrOwner).HasMaxLength(255);
            entity.Property(e => e.Location).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.OpenedBy).HasMaxLength(255);
            entity.Property(e => e.Position).HasMaxLength(255);
            entity.Property(e => e.Priority).HasMaxLength(255);
            entity.Property(e => e.SalaryRange).HasMaxLength(255);
            entity.Property(e => e.Status).HasMaxLength(255);
            entity.Property(e => e.UpdatedBy).HasMaxLength(255);

            entity.HasOne(d => d.Proposal).WithMany(p => p.RecruitmentBatches)
                .HasForeignKey(d => d.ProposalId)
                .HasConstraintName("FK_RecruitmentBatch_RecruitmentProposal");
        });

        modelBuilder.Entity<RecruitmentProposal>(entity =>
        {
            entity.ToTable("RecruitmentProposal");

            entity.HasIndex(e => e.Code, "UQ_RecruitmentProposal_Code").IsUnique();

            entity.Property(e => e.ApprovedBy).HasMaxLength(255);
            entity.Property(e => e.Code).HasMaxLength(255);
            entity.Property(e => e.ExperienceYears).HasColumnType("decimal(9, 2)");
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.Position).HasMaxLength(255);
            entity.Property(e => e.Status).HasMaxLength(255);
        });

        modelBuilder.Entity<TrackingStage>(entity =>
        {
            entity.HasKey(e => e.Code);

            entity.ToTable("TrackingStage");

            entity.Property(e => e.Code).HasMaxLength(255);
            entity.Property(e => e.Label).HasMaxLength(255);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
