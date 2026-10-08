import { Component, input, model, output } from '@angular/core';
import { HrmTableColumn, LibHrmTableComponent } from '../../libs/lib-hrm-table/lib-hrm-table.component';
import { LibSkeletonComponent } from '../../libs/lib-skeleton/lib-skeleton.component';
import { RecruitmentBatch } from '../recruitment-batch-header/recruitment-batch-header.config';

@Component({
  selector: 'lib-recruitment-batch-table',
  standalone: true,
  imports: [
    LibHrmTableComponent,
    LibSkeletonComponent,
  ],
  templateUrl: './recruitment-batch-table.component.html',
  styleUrl: './recruitment-batch-table.component.scss',
})
export class RecruitmentBatchTableComponent {
  data = input<RecruitmentBatch[]>([]);
  columns = input<HrmTableColumn<RecruitmentBatch>[]>([]);
  loading = input(false);
  selectable = input(true);

  selectedData = model<RecruitmentBatch[]>([]);

  selectionChange = output<RecruitmentBatch[]>();

  onSelectionChange(selection: RecruitmentBatch[]): void {
    this.selectedData.set(selection);
    this.selectionChange.emit(selection);
  }
}