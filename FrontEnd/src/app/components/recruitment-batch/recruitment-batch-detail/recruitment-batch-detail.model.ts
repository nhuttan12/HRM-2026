import { RecruitmentBatch } from '../recruitment-batch.model';
import {
  CandidateCertificate,
  CandidateDegree,
  CandidateSkillRow,
} from '../../candidate-profile/candidate-profile-detail/candidate-profile-detail.model';

export const RecruitmentBatchSections = {
  overview: 'overview',
  skills: 'skills',
  degrees: 'degrees',
  certificates: 'certificates',
} as const;
export type RecruitmentBatchSection =
  (typeof RecruitmentBatchSections)[keyof typeof RecruitmentBatchSections];

export type RecruitmentBatchFieldKey = keyof RecruitmentBatchDetail;

export interface RecruitmentBatchField {
  key: RecruitmentBatchFieldKey;
  label: string;
  width: 'half' | 'full';
  inputTypeWhenAdding?: 'date' | 'number';
  disabledWhenAdding?: boolean;
}

// Chi tiết đợt tuyển dụng (không ảnh hưởng model dùng cho table bên ngoài).
export interface RecruitmentBatchDetail extends RecruitmentBatch {
  // Thông tin đề xuất / duyệt
  proposalDate?: string;
  approvedBy?: string;

  // Thông tin mở / duyệt / đóng đợt
  openedBy?: string | null;
  openedDate?: string | null;
  approvedDate?: string;
  closedDate?: string | null;

  // Thông tin quản trị
  createdBy?: string;
  updatedBy?: string;
  hiringManager?: string;
  hrOwner?: string;
  department?: string;
  location?: string;
  salaryRange?: string;
  priority?: string;
  note?: string;

  // Dữ liệu chi tiết tương thích với hồ sơ ứng viên
  skills: CandidateSkillRow[];
  degrees: CandidateDegree[];
  certificates: CandidateCertificate[];
}
