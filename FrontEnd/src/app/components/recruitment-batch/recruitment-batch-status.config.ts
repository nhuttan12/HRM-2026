import { LibLabelVariant } from '../libs/lib-label/lib-label.component';
import {
  BatchStatus,
  BatchStatuses,
  ProposalStatus,
  ProposalStatuses,
} from './recruitment-batch.model';

const statusVariants: Record<BatchStatus | ProposalStatus, LibLabelVariant> = {
  [BatchStatuses.recruiting]: 'success',
  [BatchStatuses.open]: 'success',
  [BatchStatuses.closed]: 'neutral',
  [ProposalStatuses.pending]: 'warning',
  [ProposalStatuses.approved]: 'success',
};

export function batchStatusVariant(status: string): LibLabelVariant {
  return statusVariants[status as BatchStatus | ProposalStatus] ?? 'neutral';
}
