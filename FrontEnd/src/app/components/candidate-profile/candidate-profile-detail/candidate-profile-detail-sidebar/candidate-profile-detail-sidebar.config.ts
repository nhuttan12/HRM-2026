import { CandidateProfileSections } from '../candidate-profile-detail.model';
import { CandidateProfileSidebarItem } from './candidate-profile-detail-sidebar.model';

export const candidateProfileSidebarItems: CandidateProfileSidebarItem[] = [
  { label: 'Tổng quan', icon: 'pi pi-user', id: CandidateProfileSections.overview },
  { label: 'Thông tin cá nhân', icon: 'pi pi-id-card', id: CandidateProfileSections.personal },
  { label: 'Kỹ năng', icon: 'pi pi-star', id: CandidateProfileSections.skills },
  { label: 'Chứng chỉ', icon: 'pi pi-verified', id: CandidateProfileSections.certificates },
  { label: 'Kinh nghiệm', icon: 'pi pi-briefcase', id: CandidateProfileSections.experience },
  { label: 'Học vấn', icon: 'pi pi-graduation-cap', id: CandidateProfileSections.education },
];
