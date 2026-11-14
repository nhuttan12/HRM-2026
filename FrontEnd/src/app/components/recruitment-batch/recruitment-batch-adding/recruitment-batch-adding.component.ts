import { Component, input, output } from '@angular/core';
import { LibCanvasComponent } from '../../libs/lib-canvas/lib-canvas.component';
import { RecruitmentBatchDetailComponent } from '../recruitment-batch-detail/recruitment-batch-detail.component';

@Component({
  selector: 'lib-recruitment-batch-adding',
  standalone: true,
  imports: [LibCanvasComponent, RecruitmentBatchDetailComponent],
  templateUrl: './recruitment-batch-adding.component.html',
})
export class RecruitmentBatchAddingComponent {
  readonly opened = input(false);
  readonly closed = output<void>();
}
