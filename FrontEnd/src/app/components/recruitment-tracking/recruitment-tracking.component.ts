import { Component, computed, signal } from '@angular/core';
import {
  Candidate,
  mockingCandidates,
} from '../candidate-profile/candidate-profile-table/candidate-profile-table.model';
import { recruitmentBatchesData } from '../recruitment-batch/recruitment-batch.data';
import { RecruitmentBatch } from '../recruitment-batch/recruitment-batch.model';
import { columnsConfig } from '../recruitment-batch/recruitment-batch-header/recruitment-batch-header.config';
import { LibHrmTableComponent } from '../libs/lib-hrm-table/lib-hrm-table.component';
import { LibTextComponent } from '../libs/lib-text/lib-text.component';

import { TrackingStage } from './recruitment-tracking.model';
import { RecruitmentTrackingAddCandidateComponent } from './recruitment-tracking-add-candidate/recruitment-tracking-add-candidate.component';
import { RecruitmentTrackingKanbanComponent } from './recruitment-tracking-kanban/recruitment-tracking-kanban.component';

@Component({
  selector: 'app-recruitment-tracking',
  standalone: true,
  imports: [LibHrmTableComponent, LibTextComponent, RecruitmentTrackingKanbanComponent, RecruitmentTrackingAddCandidateComponent],
  templateUrl: './recruitment-tracking.component.html',
})
export class RecruitmentTrackingComponent {
  readonly columns = columnsConfig;
  readonly batches = recruitmentBatchesData.filter((batch) =>
    ['Đang tuyển', 'Đang mở'].includes(batch.status),
  );
  readonly selectedBatch = signal<RecruitmentBatch | null>(null);
  readonly addCandidateOpened = signal(false);
  private readonly boards = signal<Record<number, TrackingStage[]>>({});
  readonly stages = computed(() => {
    const batch = this.selectedBatch();
    return batch ? (this.boards()[batch.id] ?? []) : [];
  });

  readonly assignedCandidateIds = computed(() =>
    this.stages().flatMap((stage) => stage.candidates.map((candidate) => candidate.id)),
  );

  addCandidates(candidates: Candidate[]): void {
    const existing = new Set(this.assignedCandidateIds());
    const additions = candidates.filter((candidate) => !existing.has(candidate.id)).map((candidate) => ({
      ...candidate,
      recruitmentStatus: 'Đang chờ duyệt' as const,
    }));
    if (additions.length) {
      this.updateBoard(this.stages().map((stage, index) =>
        index === 0 ? { ...stage, candidates: [...stage.candidates, ...additions] } : stage,
      ));
    }
    this.addCandidateOpened.set(false);
  }

  openBatch(batch: RecruitmentBatch): void {
    if (!this.boards()[batch.id]) {
      this.boards.update((boards) => ({
        ...boards,
        [batch.id]: [
          {
            id: 'new',
            label: 'Mới',
            candidates: mockingCandidates
              .filter((candidate) => candidate.position === batch.position)
              .map((candidate) => ({ ...candidate, recruitmentStatus: 'Đang chờ duyệt' as const })),
          },
          { id: 'screening', label: 'Sàng lọc', candidates: [] },
          { id: 'interview', label: 'Phỏng vấn', candidates: [] },
          { id: 'offer', label: 'Đề nghị', candidates: [] },
          { id: 'hired', label: 'Đã tuyển', candidates: [] },
        ],
      }));
    }
    this.selectedBatch.set(batch);
  }

  updateBoard(stages: TrackingStage[]): void {
    const batch = this.selectedBatch();
    if (batch) this.boards.update((boards) => ({ ...boards, [batch.id]: stages }));
  }
}
