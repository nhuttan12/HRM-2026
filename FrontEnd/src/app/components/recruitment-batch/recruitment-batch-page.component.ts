import { Component, signal } from '@angular/core';
import { RecruitmentBatchHeaderComponent } from "./recruitment-batch-header/recruitment-batch-header.component";
import { RecruitmentBatchTableComponent } from "./recruitment-batch-table/recruitment-batch-table.component";
import { recruitmentBatchesData } from './recruitment-batch.data';
import { columnsConfig, RecruitmentBatch } from './recruitment-batch-header/recruitment-batch-header.config';

@Component({
  selector: 'lib-recruitment-batch',
  standalone: true,
  imports: [RecruitmentBatchHeaderComponent, RecruitmentBatchTableComponent],
  templateUrl: './recruitment-batch-page.component.html',
  styleUrl: './recruitment-batch-page.component.scss',
})
export class RecruitmentBatchPageComponent {
  recruitmentBatches = signal<RecruitmentBatch[]>(recruitmentBatchesData);
  loading = signal(true);

  columns = columnsConfig;

  selectedData = signal<RecruitmentBatch[]>([]);

  ngOnInit(): void {
    setTimeout(() => {
      this.loading.set(false);
    }, 1500);
  }

  onSelectionChange(selection: RecruitmentBatch[]): void {
    this.selectedData.set(selection);
  }
}