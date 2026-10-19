import { CandidateProfileDetail } from "./candidate-profile-detail.data";

export interface CandidateProfileField {
  key: keyof CandidateProfileDetail;
  label: string;
};

export const candidateProfileFields: CandidateProfileField[] = [
  { key: 'candidateCode', label: 'Mã ứng viên' },
  { key: 'fullName', label: 'Họ và tên' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Số điện thoại' },
  { key: 'position', label: 'Vị trí ứng tuyển' },
  { key: 'applicationDate', label: 'Ngày ứng tuyển' },
  { key: 'dateOfBirth', label: 'Ngày sinh' },
  { key: 'gender', label: 'Giới tính' },
  { key: 'address', label: 'Địa chỉ' },
  { key: 'educationLevel', label: 'Trình độ học vấn' },
  { key: 'experienceYears', label: 'Số năm kinh nghiệm' },
  { key: 'currentCompany', label: 'Công ty hiện tại' },
  { key: 'expectedSalary', label: 'Mức lương mong muốn' },
  { key: 'noticePeriod', label: 'Thời gian báo trước' },
];