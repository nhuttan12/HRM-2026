using System;
using System.Collections.Generic;

namespace BackEnd.Data.Entities;

public partial class TrackingStage
{
    public string Code { get; set; } = null!;

    public string Label { get; set; } = null!;

    public virtual ICollection<BatchCandidate> BatchCandidates { get; set; } = new List<BatchCandidate>();
}
