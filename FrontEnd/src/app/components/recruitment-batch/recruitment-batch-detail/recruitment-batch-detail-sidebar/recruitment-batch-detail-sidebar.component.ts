import { Component, input, output, signal } from '@angular/core';
import { LibTextComponent } from '../../../libs/lib-text/lib-text.component';
import { RecruitmentBatchSection } from '../recruitment-batch-detail.model';
import { recruitmentBatchSidebarItems } from './recruitment-batch-detail-sidebar.config';
import { LibSidebarMenuItemComponent } from '../../../libs/lib-command-button/lib-sidebar-menu-item/lib-sidebar-menu-item.component';

@Component({
  selector: 'app-recruitment-batch-detail-sidebar',
  standalone: true,
  imports: [LibTextComponent, LibSidebarMenuItemComponent],
  templateUrl: './recruitment-batch-detail-sidebar.component.html',
})
export class RecruitmentBatchDetailSidebarComponent {
  readonly sectionChange = output<RecruitmentBatchSection>();
  readonly activeSection = signal<RecruitmentBatchSection>('overview');
  readonly menuItems = recruitmentBatchSidebarItems;
  readonly batchCode = input<string | null>(null);

  selectSection(id: RecruitmentBatchSection): void {
    this.activeSection.set(id);
    this.sectionChange.emit(id);
  }
}
