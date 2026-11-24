using System;
using System.Collections.Generic;

namespace BackEnd.Data.Entities;

public partial class BatchCertificateRequirement
{
    public long Id { get; set; }

    public long BatchId { get; set; }

    public string CertificateName { get; set; } = null!;

    public string CertificateType { get; set; } = null!;

    public DateOnly IssueDate { get; set; }

    public DateOnly? ExpiryDate { get; set; }

    public string? IssuingOrganization { get; set; }

    public virtual RecruitmentBatch Batch { get; set; } = null!;
}
