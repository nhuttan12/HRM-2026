using System;
using System.Collections.Generic;

namespace BackEnd.Data.Entities;

public partial class RecruitmentBatch
{
    public long Id { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Position { get; set; } = null!;

    public int Quantity { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public string Status { get; set; } = null!;

    public decimal? ExperienceYears { get; set; }

    public DateOnly? ProposalDate { get; set; }

    public string? ApprovedBy { get; set; }

    public string? OpenedBy { get; set; }

    public DateOnly? OpenedDate { get; set; }

    public DateOnly? ApprovedDate { get; set; }

    public DateOnly? ClosedDate { get; set; }

    public string? CreatedBy { get; set; }

    public string? UpdatedBy { get; set; }

    public string? HiringManager { get; set; }

    public string? HrOwner { get; set; }

    public string? Department { get; set; }

    public string? Location { get; set; }

    public string? SalaryRange { get; set; }

    public string? Priority { get; set; }

    public string? Note { get; set; }

    public long? ProposalId { get; set; }

    public virtual ICollection<BatchCandidate> BatchCandidates { get; set; } = new List<BatchCandidate>();

    public virtual ICollection<BatchCertificateRequirement> BatchCertificateRequirements { get; set; } = new List<BatchCertificateRequirement>();

    public virtual ICollection<BatchDegreeRequirement> BatchDegreeRequirements { get; set; } = new List<BatchDegreeRequirement>();

    public virtual ICollection<BatchSkillRequirement> BatchSkillRequirements { get; set; } = new List<BatchSkillRequirement>();

    public virtual RecruitmentProposal? Proposal { get; set; }
}
