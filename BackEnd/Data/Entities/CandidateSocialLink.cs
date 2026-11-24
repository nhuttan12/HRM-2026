using System;
using System.Collections.Generic;

namespace BackEnd.Data.Entities;

public partial class CandidateSocialLink
{
    public long CandidateId { get; set; }

    public string? Facebook { get; set; }

    public string? Linkedin { get; set; }

    public string? Github { get; set; }

    public string? Portfolio { get; set; }

    public virtual Candidate Candidate { get; set; } = null!;
}
