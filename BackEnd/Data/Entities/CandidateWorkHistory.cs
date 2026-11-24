using System;
using System.Collections.Generic;

namespace BackEnd.Data.Entities;

public partial class CandidateWorkHistory
{
    public long Id { get; set; }

    public long CandidateId { get; set; }

    public string JobTitle { get; set; } = null!;

    public string CompanyName { get; set; } = null!;

    public DateOnly StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public string? Description { get; set; }

    public virtual Candidate Candidate { get; set; } = null!;
}
