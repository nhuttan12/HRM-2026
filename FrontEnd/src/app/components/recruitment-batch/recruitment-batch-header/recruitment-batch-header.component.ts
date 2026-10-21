import { Component } from '@angular/core';
import { LibTextComponent } from '../../libs/lib-text/lib-text.component';

@Component({
  selector: 'lib-recruitment-batch-header',
  standalone: true,
  templateUrl: './recruitment-batch-header.component.html',
  imports: [LibTextComponent],
})
export class RecruitmentBatchHeaderComponent {}