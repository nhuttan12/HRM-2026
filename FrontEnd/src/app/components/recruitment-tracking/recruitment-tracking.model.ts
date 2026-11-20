import { Candidate } from '../candidate-profile/candidate-profile-table/candidate-profile-table.model';

export const RecruitmentStatuses = {
  pending: 'Đang chờ duyệt',
  passed: 'Đã đậu',
  failed: 'Đã rớt',
  withdrawn: 'Đã bỏ phỏng vấn',
} as const;
export type RecruitmentStatus = (typeof RecruitmentStatuses)[keyof typeof RecruitmentStatuses];
export const recruitmentStatuses = Object.values(RecruitmentStatuses);

export const TrackingStageCodes = {
  new: 'new',
  screening: 'screening',
  interview: 'interview',
  offer: 'offer',
  hired: 'hired',
} as const;
export type TrackingStageCode = (typeof TrackingStageCodes)[keyof typeof TrackingStageCodes];
export const trackingStageDefinitions = [
  { code: TrackingStageCodes.new, label: 'Mới' },
  { code: TrackingStageCodes.screening, label: 'Sàng lọc' },
  { code: TrackingStageCodes.interview, label: 'Phỏng vấn' },
  { code: TrackingStageCodes.offer, label: 'Đề nghị' },
  { code: TrackingStageCodes.hired, label: 'Đã tuyển' },
] as const;

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
  code: TrackingStageCode;
  label: string;
  candidates: TrackingCandidate[];
}
