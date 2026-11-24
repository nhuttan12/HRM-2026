using System;
using System.Collections.Generic;

namespace BackEnd.Data.Entities;

public partial class CandidateRelative
{
    public long Id { get; set; }

    public long CandidateId { get; set; }

    public string FullName { get; set; } = null!;

    public string Relationship { get; set; } = null!;

    public int? BirthYear { get; set; }

    public string? CurrentOccupation { get; set; }

    public virtual Candidate Candidate { get; set; } = null!;
}
