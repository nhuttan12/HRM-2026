using System;
using System.Collections.Generic;

namespace BackEnd.Data.Entities;

public partial class CandidateSkill
{
    public long Id { get; set; }

    public long CandidateId { get; set; }

    public string Skill { get; set; } = null!;

    public decimal YearsOfExperience { get; set; }

    public string CompanyName { get; set; } = null!;

    public virtual Candidate Candidate { get; set; } = null!;
}
