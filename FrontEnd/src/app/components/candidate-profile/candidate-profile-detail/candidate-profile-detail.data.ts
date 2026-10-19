export interface CandidateWorkHistory {
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
}

export interface CandidateDegree {
  schoolName: string;
  graduationType: string;
  studyYear: number | null;
  graduationYear: number | null;
  major: string | null;
}

export interface CandidateCertificate {
  certificateName: string;
  certificateType: string;
  issueDate: string;
  expiryDate: string | null;
  issuingOrganization: string | null;
}

export interface CandidateRelative {
  fullName: string;
  relationship: string;
  birthYear: number | null;
  currentOccupation: string | null;
}

export interface SocicalLink {
    facebook: string | null;
    linkedin: string | null;
    github: string | null;
    portfolio: string | null;
}

export interface CandidateProfileDetail {
  // Thông tin cơ bản
  candidateCode: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;

  // Thông tin hồ sơ
  applicationDate: string;
  dateOfBirth: string | null;
  gender: 'male' | 'female' | 'other' | null;
  address: string | null;
  educationLevel: string;

  // Thông tin nghề nghiệp
  experienceYears: number | null;
  currentCompany: string | null;
  expectedSalary: number | null;
  noticePeriod: string | null;

  // Lịch sử công việc
  workHistories: CandidateWorkHistory[];

  // Bằng cấp
  degrees: CandidateDegree[];

  // Chứng chỉ
  certificates: CandidateCertificate[];

  // Thân nhân
  relatives: CandidateRelative[];

  // Liên kết mạng xã hội
  socialLinks: SocicalLink;

  // Thông tin bổ sung
  skills: string[];
  cvUrl: string | null;
  note: string | null;
}