import { Component, input } from '@angular/core';
import { LibTextComponent } from '../../libs/lib-text/lib-text.component';
import { RecruitmentBatch } from '../recruitment-batch.model';
import { RecruitmentBatchField } from './recruitment-batch-detail.model';
import { recruitmentBatchFields } from './recruitment-batch-detail.config';

@Component({
  selector: 'lib-recruitment-batch-detail',
  standalone: true,
  imports: [LibTextComponent],
  templateUrl: './recruitment-batch-detail.component.html',
})
export class RecruitmentBatchDetailComponent {
  data = input<RecruitmentBatch | null>(null);
  fields = recruitmentBatchFields;

  getValue(fieldKey: RecruitmentBatchField['key']): string {
    const item = this.data();
    if (!item) return '';
    const value = item[fieldKey];
    return value === undefined || value === null ? '' : String(value);
  }
}
