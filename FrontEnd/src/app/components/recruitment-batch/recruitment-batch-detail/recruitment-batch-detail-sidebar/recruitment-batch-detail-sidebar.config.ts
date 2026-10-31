import { RecruitmentBatchSection } from '../recruitment-batch-detail.model';

export interface RecruitmentBatchSidebarItem {
  id: RecruitmentBatchSection;
  label: string;
  icon: string;
}

export const recruitmentBatchSidebarItems: RecruitmentBatchSidebarItem[] = [
  { id: 'overview', label: 'Tổng quan', icon: 'pi pi-list' },
  { id: 'skills', label: 'Kỹ năng', icon: 'pi pi-star' },
  { id: 'degrees', label: 'Bằng cấp', icon: 'pi pi-graduation-cap' },
  { id: 'certificates', label: 'Chứng chỉ', icon: 'pi pi-verified' },
];
