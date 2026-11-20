import { LibLabelVariant } from '../libs/lib-label/lib-label.component';
import { RecruitmentStatus, RecruitmentStatuses } from './recruitment-tracking.model';

const statusVariants: Record<RecruitmentStatus, LibLabelVariant> = {
  [RecruitmentStatuses.pending]: 'warning',
  [RecruitmentStatuses.passed]: 'success',
  [RecruitmentStatuses.failed]: 'error',
  [RecruitmentStatuses.withdrawn]: 'error',
};

export function recruitmentStatusVariant(status: string): LibLabelVariant {
  return statusVariants[status as RecruitmentStatus] ?? 'neutral';
}
