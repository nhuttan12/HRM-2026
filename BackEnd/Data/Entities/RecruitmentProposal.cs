using System;
using System.Collections.Generic;

namespace BackEnd.Data.Entities;

public partial class RecruitmentProposal
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

    public virtual ICollection<RecruitmentBatch> RecruitmentBatches { get; set; } = new List<RecruitmentBatch>();
}
