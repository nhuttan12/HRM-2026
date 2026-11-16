import { Candidate } from '../candidate-profile/candidate-profile-table/candidate-profile-table.model';

export const recruitmentStatuses = [
  'Đang chờ duyệt',
  'Đã đậu',
  'Đã rớt',
  'Đã bỏ phỏng vấn',
] as const;
export type RecruitmentStatus = (typeof recruitmentStatuses)[number];

export interface InterviewRound {
  id: string;
  name: string;
  interviewer: string;
  interviewDate: string;
  status: RecruitmentStatus;
}

export interface TrackingCandidate extends Candidate {
  recruitmentStatus: RecruitmentStatus;
}

export interface TrackingStage {
  id: string;
  label: string;
  candidates: TrackingCandidate[];
}
