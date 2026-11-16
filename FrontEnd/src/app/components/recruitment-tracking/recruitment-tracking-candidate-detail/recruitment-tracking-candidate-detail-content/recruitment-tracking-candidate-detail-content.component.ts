import { Component, input, output, signal } from '@angular/core';
import { LibCanvasComponent } from '../../../libs/lib-canvas/lib-canvas.component';
import {
  LibHrmTableComponent,
  HrmTableColumn,
} from '../../../libs/lib-hrm-table/lib-hrm-table.component';
import { LibSaveButtonComponent } from '../../../libs/lib-command-button/lib-save-button/lib-save-button.component';
import { LibTextComponent } from '../../../libs/lib-text/lib-text.component';
import { LibLabelComponent, LibLabelVariant } from '../../../libs/lib-label/lib-label.component';
import { RecruitmentBatch } from '../../../recruitment-batch/recruitment-batch.model';
import {
  InterviewRound,
  recruitmentStatuses,
  RecruitmentStatus,
  TrackingCandidate,
} from '../../recruitment-tracking.model';
import { CandidateDetailSection } from '../recruitment-tracking-candidate-detail.model';

@Component({
  selector: 'app-recruitment-tracking-candidate-detail-content',
  standalone: true,
  imports: [
    LibCanvasComponent,
    LibHrmTableComponent,
    LibSaveButtonComponent,
    LibTextComponent,
    LibLabelComponent,
  ],
  templateUrl: './recruitment-tracking-candidate-detail-content.component.html',
})
export class RecruitmentTrackingCandidateDetailContentComponent {
  readonly candidate = input.required<TrackingCandidate>();
  readonly batch = input.required<RecruitmentBatch>();
  readonly rounds = input.required<InterviewRound[]>();
  readonly activeSection = input.required<CandidateDetailSection>();
  readonly roundsChange = output<InterviewRound[]>();
  readonly editingRound = signal<InterviewRound | null>(null);
  readonly selectedStatus = signal<RecruitmentStatus>('Đang chờ duyệt');
  readonly statusCanvasOpened = signal(false);
  readonly statuses = recruitmentStatuses;
  readonly statusVariants: Record<RecruitmentStatus, LibLabelVariant> = {
    'Đang chờ duyệt': 'warning',
    'Đã đậu': 'success',
    'Đã rớt': 'error',
    'Đã bỏ phỏng vấn': 'error',
  };
  readonly columns: HrmTableColumn<InterviewRound>[] = [
    { field: 'name', header: 'Tên vòng', width: '200px' },
    { field: 'interviewer', header: 'Người phỏng vấn', width: '200px' },
    { field: 'interviewDate', header: 'Ngày phỏng vấn', width: '160px' },
    { field: 'status', header: 'Tình trạng', width: '170px' },
  ];

  statusVariant(status: string): LibLabelVariant {
    return this.statusVariants[status as RecruitmentStatus] ?? 'neutral';
  }

  editRound(round: InterviewRound): void {
    this.editingRound.set(round);
    this.selectedStatus.set(round.status);
    this.statusCanvasOpened.set(true);
  }

  setStatus(value: string): void {
    if (this.statuses.some((status) => status === value))
      this.selectedStatus.set(value as RecruitmentStatus);
  }

  confirm(): void {
    const round = this.editingRound();
    if (!round) return;
    this.roundsChange.emit(
      this.rounds().map((item) =>
        item.id === round.id ? { ...item, status: this.selectedStatus() } : item,
      ),
    );
    this.statusCanvasOpened.set(false);
  }

  closeStatus(): void {
    this.statusCanvasOpened.set(false);
    this.editingRound.set(null);
  }
}
