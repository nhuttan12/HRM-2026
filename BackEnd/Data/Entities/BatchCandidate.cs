using System;
using System.Collections.Generic;

namespace BackEnd.Data.Entities;

public partial class BatchCandidate
{
    public long Id { get; set; }

    public long BatchId { get; set; }

    public long CandidateId { get; set; }

    public string StageCode { get; set; } = null!;

    public string RecruitmentStatus { get; set; } = null!;

    public virtual RecruitmentBatch Batch { get; set; } = null!;

    public virtual Candidate Candidate { get; set; } = null!;

    public virtual ICollection<InterviewRound> InterviewRounds { get; set; } = new List<InterviewRound>();

    public virtual TrackingStage StageCodeNavigation { get; set; } = null!;
}
