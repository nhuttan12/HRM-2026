using System;
using System.Collections.Generic;

namespace BackEnd.Data.Entities;

public partial class Candidate
{
    public long Id { get; set; }

    public string CandidateCode { get; set; } = null!;

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string Position { get; set; } = null!;

    public DateOnly ApplicationDate { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public string? Gender { get; set; }

    public string? Address { get; set; }

    public string EducationLevel { get; set; } = null!;

    public decimal? ExperienceYears { get; set; }

    public string? CurrentCompany { get; set; }

    public decimal? ExpectedSalary { get; set; }

    public string? NoticePeriod { get; set; }

    public string? CvUrl { get; set; }

    public string? Note { get; set; }

    public virtual ICollection<BatchCandidate> BatchCandidates { get; set; } = new List<BatchCandidate>();

    public virtual ICollection<CandidateCertificate> CandidateCertificates { get; set; } = new List<CandidateCertificate>();

    public virtual ICollection<CandidateDegree> CandidateDegrees { get; set; } = new List<CandidateDegree>();

    public virtual ICollection<CandidateRelative> CandidateRelatives { get; set; } = new List<CandidateRelative>();

    public virtual ICollection<CandidateSkill> CandidateSkills { get; set; } = new List<CandidateSkill>();

    public virtual CandidateSocialLink? CandidateSocialLink { get; set; }

    public virtual ICollection<CandidateWorkHistory> CandidateWorkHistories { get; set; } = new List<CandidateWorkHistory>();
}
