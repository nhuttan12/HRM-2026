using System;
using System.Collections.Generic;

namespace BackEnd.Data.Entities;

public partial class InterviewRound
{
    public long Id { get; set; }

    public long BatchCandidateId { get; set; }

    public string RoundCode { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Interviewer { get; set; } = null!;

    public DateTime? InterviewDate { get; set; }

    public string Status { get; set; } = null!;

    public virtual BatchCandidate BatchCandidate { get; set; } = null!;
}
