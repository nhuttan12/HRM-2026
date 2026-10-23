import { HrmTableColumn } from "../../libs/lib-hrm-table/lib-hrm-table.component";
import { CandidateCertificate, CandidateDegree, CandidateListSection, CandidateProfileField, CandidateSkillRow, CandidateWorkHistory, ListFieldConfig } from "./candidate-profile-detail.model";

export const candidateProfileFields: CandidateProfileField[] = [
  { key: 'candidateCode', label: 'Mã ứng viên', width: 'half' },
  { key: 'fullName', label: 'Họ và tên', width: 'half' },
  { key: 'email', label: 'Email', width: 'half' },
  { key: 'phone', label: 'Số điện thoại', width: 'half' },
  { key: 'position', label: 'Vị trí ứng tuyển', width: 'half' },
  { key: 'applicationDate', label: 'Ngày ứng tuyển', width: 'half' },
  { key: 'dateOfBirth', label: 'Ngày sinh', width: 'half' },
  { key: 'gender', label: 'Giới tính', width: 'half' },
  { key: 'address', label: 'Địa chỉ', width: 'full' },
  { key: 'educationLevel', label: 'Trình độ học vấn', width: 'half' },
  { key: 'experienceYears', label: 'Số năm kinh nghiệm', width: 'half' },
  { key: 'currentCompany', label: 'Công ty hiện tại', width: 'half' },
  { key: 'expectedSalary', label: 'Mức lương mong muốn', width: 'half' },
  { key: 'noticePeriod', label: 'Thời gian báo trước', width: 'half' },
  { key: 'cvUrl', label: 'CV ứng viên', width: 'half' },
  { key: 'note', label: 'Ghi chú', width: 'full' },
];

export const candidateSkillColumns: HrmTableColumn<CandidateSkillRow>[] = [
  { field: 'skill', header: 'Kỹ năng', width: '200px' },
  {
    field: 'yearsOfExperience',
    header: 'Số năm kinh nghiệm',
    width: '180px',
  },
  { field: 'companyName', header: 'Công ty áp dụng', width: '220px' },
];

export const candidateWorkHistoryColumns: HrmTableColumn<CandidateWorkHistory>[] = [
  { field: 'jobTitle', header: 'Vị trí công việc', width: '180px' },
  { field: 'companyName', header: 'Công ty', width: '180px' },
  { field: 'startDate', header: 'Ngày bắt đầu', width: '140px' },
  { field: 'endDate', header: 'Ngày kết thúc', width: '140px' },
  { field: 'description', header: 'Mô tả công việc', width: '240px' },
];

export const candidateDegreeColumns: HrmTableColumn<CandidateDegree>[] = [
  { field: 'schoolName', header: 'Trường học', width: '200px' },
  { field: 'graduationType', header: 'Loại bằng cấp', width: '160px' },
  { field: 'major', header: 'Chuyên ngành', width: '180px' },
  { field: 'studyYear', header: 'Năm học', width: '100px' },
  { field: 'graduationYear', header: 'Năm tốt nghiệp', width: '140px' },
];

export const candidateCertificateColumns: HrmTableColumn<CandidateCertificate>[] = [
  { field: 'certificateName', header: 'Tên chứng chỉ', width: '200px' },
  { field: 'certificateType', header: 'Loại chứng chỉ', width: '150px' },
  { field: 'issueDate', header: 'Ngày cấp', width: '130px' },
  { field: 'expiryDate', header: 'Ngày hết hạn', width: '130px' },
  {
    field: 'issuingOrganization',
    header: 'Đơn vị cấp',
    width: '200px',
  },
];

export const candidateListFieldConfigs: Record<CandidateListSection, ListFieldConfig[]> = {
  skills: [
    { key: 'name', label: 'Tên kỹ năng', required: true },
    { key: 'level', label: 'Trình độ' },
    { key: 'yearsOfExperience', label: 'Số năm kinh nghiệm', type: 'number' },
  ],
  certificates: [
    { key: 'name', label: 'Tên chứng chỉ', required: true },
    { key: 'issuedBy', label: 'Đơn vị cấp' },
    { key: 'issueDate', label: 'Ngày cấp', type: 'date' },
    { key: 'expiryDate', label: 'Ngày hết hạn', type: 'date' },
  ],
  workHistories: [
    { key: 'companyName', label: 'Công ty', required: true },
    { key: 'position', label: 'Chức vụ' },
    { key: 'startDate', label: 'Ngày bắt đầu', type: 'date' },
    { key: 'endDate', label: 'Ngày kết thúc', type: 'date' },
    { key: 'description', label: 'Mô tả công việc', type: 'textarea' },
  ],
  degrees: [
    { key: 'schoolName', label: 'Trường đào tạo', required: true },
    { key: 'degreeName', label: 'Bằng cấp' },
    { key: 'major', label: 'Chuyên ngành' },
    { key: 'graduationYear', label: 'Năm tốt nghiệp', type: 'number' },
  ],
};