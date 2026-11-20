export const BatchStatuses = {
  recruiting: 'Đang tuyển',
  open: 'Đang mở',
  closed: 'Đã kết thúc',
} as const;
export const ProposalStatuses = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
} as const;
export type BatchStatus = (typeof BatchStatuses)[keyof typeof BatchStatuses];
export type ProposalStatus = (typeof ProposalStatuses)[keyof typeof ProposalStatuses];

export const BatchTabs = { proposal: 'proposal', batch: 'batch' } as const;

export interface RecruitmentBatch {
  id: number;
  code: string;
  name: string;
  position: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: BatchStatus | ProposalStatus;
  experienceYears?: number;
}

export type ActiveTab = (typeof BatchTabs)[keyof typeof BatchTabs];

export interface RecruitmentProposal extends RecruitmentBatch {
  status: ProposalStatus;
  proposalDate?: string;
  approvedBy?: string;
}
