import {
  RecruitmentBatchSection,
  RecruitmentBatchSections,
} from '../recruitment-batch-detail.model';

export interface RecruitmentBatchSidebarItem {
  id: RecruitmentBatchSection;
  label: string;
  icon: string;
}

export const recruitmentBatchSidebarItems: RecruitmentBatchSidebarItem[] = [
  { id: RecruitmentBatchSections.overview, label: 'Tổng quan', icon: 'pi pi-list' },
  { id: RecruitmentBatchSections.skills, label: 'Kỹ năng', icon: 'pi pi-star' },
  { id: RecruitmentBatchSections.degrees, label: 'Bằng cấp', icon: 'pi pi-graduation-cap' },
  { id: RecruitmentBatchSections.certificates, label: 'Chứng chỉ', icon: 'pi pi-verified' },
];
