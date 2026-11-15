import { Candidate } from '../candidate-profile/candidate-profile-table/candidate-profile-table.model';

export type RecruitmentStatus = 'Đang chờ duyệt' | 'Đã đậu' | 'Đã rớt' | 'Đã bỏ phỏng vấn';

export interface TrackingCandidate extends Candidate {
  recruitmentStatus: RecruitmentStatus;
}

export interface TrackingStage {
  id: string;
  label: string;
  candidates: TrackingCandidate[];
}
