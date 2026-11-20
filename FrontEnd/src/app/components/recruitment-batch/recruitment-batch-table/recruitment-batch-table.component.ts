import { Component, input, model, output } from '@angular/core';
import {
  HrmTableColumn,
  LibHrmTableComponent,
} from '../../libs/lib-hrm-table/lib-hrm-table.component';
import { LibSkeletonComponent } from '../../libs/lib-skeleton/lib-skeleton.component';
import { RecruitmentBatch } from '../recruitment-batch.model';
import { LibLabelComponent } from '../../libs/lib-label/lib-label.component';
import { batchStatusVariant } from '../recruitment-batch-status.config';

@Component({
  selector: 'app-recruitment-batch-table',
  standalone: true,
  imports: [LibHrmTableComponent, LibSkeletonComponent, LibLabelComponent],
  templateUrl: './recruitment-batch-table.component.html',
})
export class RecruitmentBatchTableComponent {
  readonly statusVariant = batchStatusVariant;
  data = input<RecruitmentBatch[]>([]);
  columns = input<HrmTableColumn<RecruitmentBatch>[]>([]);
  loading = input(false);
  selectable = input(true);
  maxHeight = input('32rem');

  selectedData = model<RecruitmentBatch[]>([]);

  selectionChange = output<RecruitmentBatch[]>();
  rowDoubleClick = output<RecruitmentBatch>();

  onSelectionChange(selection: RecruitmentBatch[]): void {
    this.selectedData.set(selection);
    this.selectionChange.emit(selection);
  }

  onRowDoubleClick(row: RecruitmentBatch): void {
    this.rowDoubleClick.emit(row);
  }
}
