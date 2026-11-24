using System;
using System.Collections.Generic;

namespace BackEnd.Data.Entities;

public partial class BatchSkillRequirement
{
    public long Id { get; set; }

    public long BatchId { get; set; }

    public string Skill { get; set; } = null!;

    public decimal YearsOfExperience { get; set; }

    public string CompanyName { get; set; } = null!;

    public virtual RecruitmentBatch Batch { get; set; } = null!;
}
