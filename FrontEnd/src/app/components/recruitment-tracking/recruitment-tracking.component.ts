import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import {
  Candidate,
  mockingCandidates,
} from '../candidate-profile/candidate-profile-table/candidate-profile-table.model';
import { recruitmentBatchesData } from '../recruitment-batch/recruitment-batch.data';
import { BatchStatuses, RecruitmentBatch } from '../recruitment-batch/recruitment-batch.model';
import { batchStatusVariant } from '../recruitment-batch/recruitment-batch-status.config';
import { LibLabelComponent } from '../libs/lib-label/lib-label.component';
import { columnsConfig } from '../recruitment-batch/recruitment-batch-header/recruitment-batch-header.config';
import { LibHrmTableComponent } from '../libs/lib-hrm-table/lib-hrm-table.component';
import { LibTextComponent } from '../libs/lib-text/lib-text.component';
import { LibSkeletonComponent } from '../libs/lib-skeleton/lib-skeleton.component';

import {
  InterviewRound,
  RecruitmentStatuses,
  TrackingCandidate,
  TrackingStage,
  TrackingStageCodes,
  trackingStageDefinitions,
} from './recruitment-tracking.model';
import { LibCanvasComponent } from '../libs/lib-canvas/lib-canvas.component';
import { RecruitmentTrackingCandidateDetailComponent } from './recruitment-tracking-candidate-detail/recruitment-tracking-candidate-detail.component';
import { RecruitmentTrackingAddCandidateComponent } from './recruitment-tracking-add-candidate/recruitment-tracking-add-candidate.component';
import { RecruitmentTrackingKanbanComponent } from './recruitment-tracking-kanban/recruitment-tracking-kanban.component';

@Component({
  selector: 'app-recruitment-tracking',
  standalone: true,
  imports: [
    LibHrmTableComponent,
    LibCanvasComponent,
    RecruitmentTrackingCandidateDetailComponent,
    LibTextComponent,
    LibLabelComponent,
    LibSkeletonComponent,
    RecruitmentTrackingKanbanComponent,
    RecruitmentTrackingAddCandidateComponent,
  ],
  templateUrl: './recruitment-tracking.component.html',
})
export class RecruitmentTrackingComponent {
  readonly statusVariant = batchStatusVariant;
  readonly columns = columnsConfig;
  readonly listLoading = signal(true);
  readonly kanbanLoading = signal(false);
  private listTimer: ReturnType<typeof setTimeout> | undefined;
  private kanbanTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    this.listTimer = setTimeout(() => this.listLoading.set(false), 800);
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.listTimer);
      clearTimeout(this.kanbanTimer);
    });
  }
  readonly batches = recruitmentBatchesData.filter(
    (batch) => batch.status === BatchStatuses.recruiting || batch.status === BatchStatuses.open,
  );
  readonly selectedBatch = signal<RecruitmentBatch | null>(null);
  readonly addCandidateOpened = signal(false);
  readonly detailOpened = signal(false);
  readonly detailCandidate = signal<TrackingCandidate | null>(null);
  private readonly interviewRounds = signal<Record<string, InterviewRound[]>>({});
  readonly selectedRounds = computed(() => {
    const batch = this.selectedBatch();
    const candidate = this.detailCandidate();
    return batch && candidate ? (this.interviewRounds()[`${batch.id}:${candidate.id}`] ?? []) : [];
  });
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
    const additions = candidates
      .filter((candidate) => !existing.has(candidate.id))
      .map((candidate) => ({
        ...candidate,
        recruitmentStatus: RecruitmentStatuses.pending,
      }));
    if (additions.length) {
      this.updateBoard(
        this.stages().map((stage, index) =>
          index === 0 ? { ...stage, candidates: [...stage.candidates, ...additions] } : stage,
        ),
      );
    }
    this.addCandidateOpened.set(false);
  }

  openCandidateDetail(candidate: TrackingCandidate): void {
    const batch = this.selectedBatch();
    if (!batch) return;
    const key = `${batch.id}:${candidate.id}`;
    if (!this.interviewRounds()[key]) {
      this.interviewRounds.update((all) => ({
        ...all,
        [key]: [
          {
            id: 'screening',
            name: 'Sàng lọc',
            interviewer: 'Chưa cập nhật',
            interviewDate: 'Chưa cập nhật',
            status: RecruitmentStatuses.pending,
          },
          {
            id: 'interview',
            name: 'Phỏng vấn',
            interviewer: 'Chưa cập nhật',
            interviewDate: 'Chưa cập nhật',
            status: RecruitmentStatuses.pending,
          },
        ],
      }));
    }
    this.detailCandidate.set(candidate);
    this.detailOpened.set(true);
  }

  updateRounds(rounds: InterviewRound[]): void {
    const batch = this.selectedBatch();
    const candidate = this.detailCandidate();
    if (batch && candidate)
      this.interviewRounds.update((all) => ({ ...all, [`${batch.id}:${candidate.id}`]: rounds }));
  }

  closeBatch(): void {
    clearTimeout(this.kanbanTimer);
    this.kanbanLoading.set(false);
    this.selectedBatch.set(null);
  }

  openBatch(batch: RecruitmentBatch): void {
    clearTimeout(this.kanbanTimer);
    this.kanbanLoading.set(true);
    if (!this.boards()[batch.id]) {
      this.boards.update((boards) => ({
        ...boards,
        [batch.id]: trackingStageDefinitions.map((stage) => ({
          ...stage,
          candidates:
            stage.code === TrackingStageCodes.new
              ? mockingCandidates
                  .filter((candidate) => candidate.position === batch.position)
                  .map((candidate) => ({
                    ...candidate,
                    recruitmentStatus: RecruitmentStatuses.pending,
                  }))
              : [],
        })),
      }));
    }
    this.selectedBatch.set(batch);
    this.kanbanTimer = setTimeout(() => this.kanbanLoading.set(false), 600);
  }

  updateBoard(stages: TrackingStage[]): void {
    const batch = this.selectedBatch();
    if (batch) this.boards.update((boards) => ({ ...boards, [batch.id]: stages }));
  }
}
