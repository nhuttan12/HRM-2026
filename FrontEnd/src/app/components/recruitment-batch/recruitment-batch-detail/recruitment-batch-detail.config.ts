import { RecruitmentBatchField } from "./recruitment-batch-detail.model";
import {
  candidateCertificateColumns,
  candidateDegreeColumns,
  candidateSkillColumns,
} from "../../candidate-profile/candidate-profile-detail/candidate-profile-detail.config";

export const recruitmentBatchFields: RecruitmentBatchField[] = [
  { key: 'code', label: 'Mã đợt tuyển dụng', width: 'half' },
  { key: 'name', label: 'Tên đợt tuyển dụng', width: 'half' },
  { key: 'position', label: 'Vị trí tuyển dụng', width: 'half' },
  { key: 'quantity', label: 'Số lượng', width: 'half' },
  { key: 'startDate', label: 'Ngày bắt đầu', width: 'half' },
  { key: 'endDate', label: 'Ngày kết thúc', width: 'half' },
  { key: 'status', label: 'Trạng thái', width: 'half' },
  { key: 'experienceYears', label: 'Số năm kinh nghiệm', width: 'half' },
  { key: 'skills', label: 'Kỹ năng', width: 'full' },
  { key: 'degrees', label: 'Bằng cấp', width: 'full' },
  { key: 'certificates', label: 'Chứng chỉ', width: 'full' },
];

export const recruitmentBatchSkillColumns = candidateSkillColumns;
export const recruitmentBatchDegreeColumns = candidateDegreeColumns;
export const recruitmentBatchCertificateColumns = candidateCertificateColumns;
