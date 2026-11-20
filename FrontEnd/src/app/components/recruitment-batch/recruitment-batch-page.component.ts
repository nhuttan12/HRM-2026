import { Component, signal, computed, OnInit } from '@angular/core';
import { RecruitmentBatchHeaderComponent } from './recruitment-batch-header/recruitment-batch-header.component';
import { RecruitmentBatchAddingComponent } from './recruitment-batch-adding/recruitment-batch-adding.component';
import { RecruitmentBatchTableComponent } from './recruitment-batch-table/recruitment-batch-table.component';
import { RecruitmentBatchDetailComponent } from './recruitment-batch-detail/recruitment-batch-detail.component';
import { LibCanvasComponent } from '../libs/lib-canvas/lib-canvas.component';
import { LibTabButtonComponent } from '../libs/lib-command-button/lib-tab-button/lib-tab-button.component';
import { recruitmentBatchesData, recruitmentProposalsData } from './recruitment-batch.data';
import { columnsConfig } from './recruitment-batch-header/recruitment-batch-header.config';
import {
  ActiveTab,
  BatchTabs,
  RecruitmentBatch,
  RecruitmentProposal,
} from './recruitment-batch.model';

@Component({
  selector: 'lib-recruitment-batch',
  standalone: true,
  imports: [
    RecruitmentBatchHeaderComponent,
    RecruitmentBatchAddingComponent,
    RecruitmentBatchTableComponent,
    RecruitmentBatchDetailComponent,
    LibCanvasComponent,
    LibTabButtonComponent,
  ],
  templateUrl: './recruitment-batch-page.component.html',
})
export class RecruitmentBatchPageComponent implements OnInit {
  recruitmentBatches = signal<RecruitmentBatch[]>(recruitmentBatchesData);
  recruitmentProposals = signal<RecruitmentProposal[]>(recruitmentProposalsData);
  showAddCanvas = signal(false);
  addMode = signal<'direct' | 'from-proposal' | null>(null);

  proposalBatches = computed(() => this.recruitmentProposals() as unknown as RecruitmentBatch[]);
  loading = signal(true);

  columns = columnsConfig;

  selectedData = signal<RecruitmentBatch[]>([]);
  selectedBatch = signal<RecruitmentBatch | null>(null);
  showDetailCanvas = signal(false);

  readonly batchTabs = BatchTabs;
  activeTab = signal<ActiveTab>(BatchTabs.batch);

  ngOnInit(): void {
    setTimeout(() => {
      this.loading.set(false);
    }, 1500);
  }

  onTabChange(tab: ActiveTab): void {
    this.activeTab.set(tab);
  }

  onAddDirect(): void {
    this.showAddCanvas.set(true);
  }

  onAddFromProposal(): void {
    this.addMode.set('from-proposal');
  }

  onAddProposal(): void {
    console.log('ThÃªm Ä‘á» xuáº¥t tuyá»ƒn dá»¥ng (tÆ°Æ¡ng Ä‘Æ°Æ¡ng click row)');
  }

  onSelectionChange(selection: RecruitmentBatch[]): void {
    this.selectedData.set(selection);
  }

  onBatchDoubleClick(batch: RecruitmentBatch): void {
    this.selectedBatch.set(batch);
    this.showDetailCanvas.set(true);
  }

  onCloseDetailCanvas(): void {
    this.showDetailCanvas.set(false);
    this.selectedBatch.set(null);
  }
}
