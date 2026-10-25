import { Component, signal, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { RecruitmentBatchHeaderComponent } from "./recruitment-batch-header/recruitment-batch-header.component";
import { RecruitmentBatchTableComponent } from "./recruitment-batch-table/recruitment-batch-table.component";
import { recruitmentBatchesData, recruitmentProposalsData } from './recruitment-batch.data';
import { columnsConfig } from './recruitment-batch-header/recruitment-batch-header.config';
import { ActiveTab, RecruitmentBatch, RecruitmentProposal } from './recruitment-batch.model';

export function slideTabAnimation() {
  return trigger('slideTab', [
    transition('proposal <=> batch', [
      query(':enter, :leave', [
        style({ position: 'absolute', top: 0, left: 0, width: '100%' })
      ], { optional: true }),
      group([
        query(':enter', [
          style({ transform: 'translateX(100%)' }),
          animate('300ms ease-out', style({ transform: 'translateX(0)' }))
        ], { optional: true }),
        query(':leave', [
          animate('300ms ease-out', style({ transform: 'translateX(-100%)' }))
        ], { optional: true })
      ])
    ])
  ]);
}

@Component({
  selector: 'lib-recruitment-batch',
  standalone: true,
  imports: [RecruitmentBatchHeaderComponent, RecruitmentBatchTableComponent],
  templateUrl: './recruitment-batch-page.component.html',
  animations: [slideTabAnimation()]
})
export class RecruitmentBatchPageComponent implements OnInit {
  recruitmentBatches = signal<RecruitmentBatch[]>(recruitmentBatchesData);
  recruitmentProposals = signal<RecruitmentProposal[]>(recruitmentProposalsData);
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

  onSelectionChange(selection: RecruitmentBatch[]): void {
    this.selectedData.set(selection);
  }
}