import { RecruitmentBatch } from "../recruitment-batch.model";
import {
  CandidateCertificate,
  CandidateDegree,
  CandidateSkillRow,
} from "../../candidate-profile/candidate-profile-detail/candidate-profile-detail.model";

export type RecruitmentBatchSection =
  | 'overview'
  | 'skills'
  | 'degrees'
  | 'certificates';

export type RecruitmentBatchFieldKey =
  | keyof RecruitmentBatch
  | 'experienceYears'
  | 'skills'
  | 'degrees'
  | 'certificates'
  // Ngày / người liên quan đến đợt tuyển dụng
  | 'proposalDate'
  | 'approvedBy'
  | 'openedBy'
  | 'openedDate'
  | 'approvedDate'
  | 'closedDate'
  | 'createdBy'
  | 'updatedBy'
  | 'hiringManager'
  | 'hrOwner'
  | 'department'
  | 'location'
  | 'salaryRange'
  | 'priority'
  | 'note';

export interface RecruitmentBatchField {
  key: RecruitmentBatchFieldKey;
  label: string;
  width: 'half' | 'full';
}

// Chi tiết đợt tuyển dụng (không ảnh hưởng model dùng cho table bên ngoài).
export interface RecruitmentBatchDetail extends RecruitmentBatch {
  // Thông tin đề xuất / duyệt
  proposalDate?: string;
  approvedBy?: string;

  // Thông tin mở / duyệt / đóng đợt
  openedBy?: string;
  openedDate?: string;
  approvedDate?: string;
  closedDate?: string;

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

