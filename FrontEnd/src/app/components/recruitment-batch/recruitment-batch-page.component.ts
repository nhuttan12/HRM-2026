import { Component, signal, computed, OnInit } from '@angular/core';
import { RecruitmentBatchHeaderComponent } from "./recruitment-batch-header/recruitment-batch-header.component";
import { RecruitmentBatchTableComponent } from "./recruitment-batch-table/recruitment-batch-table.component";
import { recruitmentBatchesData, recruitmentProposalsData } from './recruitment-batch.data';
import { columnsConfig } from './recruitment-batch-header/recruitment-batch-header.config';
import { ActiveTab, RecruitmentBatch, RecruitmentProposal } from './recruitment-batch.model';

@Component({
  selector: 'lib-recruitment-batch',
  standalone: true,
  imports: [RecruitmentBatchHeaderComponent, RecruitmentBatchTableComponent],
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

  activeTab = signal<ActiveTab>('batch');

  ngOnInit(): void {
    setTimeout(() => {
      this.loading.set(false);
    }, 1500);
  }

  onTabChange(tab: ActiveTab): void {
    this.activeTab.set(tab);
  }

  onAddDirect(): void {
    this.addMode.set('direct');
    this.showAddCanvas.set(true);
  }

  onAddFromProposal(): void {
    this.addMode.set('from-proposal');
    this.showAddCanvas.set(true);
  }

  onAddProposal(): void {
    console.log('Thêm đề xuất tuyển dụng (tương đương click row)');
  }

  onSelectionChange(selection: RecruitmentBatch[]): void {
    this.selectedData.set(selection);
  }
}