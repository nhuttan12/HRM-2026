using System;
using System.Collections.Generic;

namespace BackEnd.Data.Entities;

public partial class CandidateCertificate
{
    public long Id { get; set; }

    public long CandidateId { get; set; }

    public string CertificateName { get; set; } = null!;

    public string CertificateType { get; set; } = null!;

    public DateOnly IssueDate { get; set; }

    public DateOnly? ExpiryDate { get; set; }

    public string? IssuingOrganization { get; set; }

    public virtual Candidate Candidate { get; set; } = null!;
}
