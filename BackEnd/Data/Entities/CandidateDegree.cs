using System;
using System.Collections.Generic;

namespace BackEnd.Data.Entities;

public partial class CandidateDegree
{
    public long Id { get; set; }

    public long CandidateId { get; set; }

    public string SchoolName { get; set; } = null!;

    public string GraduationType { get; set; } = null!;

    public int? StudyYear { get; set; }

    public int? GraduationYear { get; set; }

    public string? Major { get; set; }

    public virtual Candidate Candidate { get; set; } = null!;
}
