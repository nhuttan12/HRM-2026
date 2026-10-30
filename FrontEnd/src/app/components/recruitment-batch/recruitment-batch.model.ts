export interface RecruitmentBatch {
  id: number;
  code: string;
  name: string;
  position: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: string;
  experienceYears?: number;
}

export type ActiveTab = 'proposal' | 'batch';

export interface RecruitmentProposal extends RecruitmentBatch {
  proposalDate?: string;
  approvedBy?: string;
}
