import { Component, input, output } from '@angular/core';
import { LibTextComponent } from '../../libs/lib-text/lib-text.component';
import { LibAddButtonComponent } from '../../libs/lib-command-button/lib-add-button/lib-add-button.component';
import { LibRemoveButtonComponent } from '../../libs/lib-command-button/lib-remove-button/lib-remove-button.component';
import { LibDropdownMenuComponent } from '../../libs/lib-dropdown-menu/lib-dropdown-menu.component';
import { MenuItem } from 'primeng/api';
import { ActiveTab } from '../recruitment-batch.model';

@Component({
  selector: 'lib-recruitment-batch-header',
  standalone: true,
  templateUrl: './recruitment-batch-header.component.html',
  imports: [
    LibTextComponent,
    LibAddButtonComponent,
    LibDropdownMenuComponent,
    LibRemoveButtonComponent,
  ],
})
export class RecruitmentBatchHeaderComponent {
  activeTab = input<ActiveTab>();

  addDirect = output<void>();
  addFromProposal = output<void>();
  addProposal = output<void>();

  menuItems: MenuItem[] = [
    {
      id: 'direct',
      label: 'Mở đợt tuyển dụng trực tiếp',
      icon: 'pi pi-play',
      command: () => this.addDirect.emit(),
    },
    {
      id: 'from-proposal',
      label: 'Mở đợt tuyển dụng từ đề xuất',
      icon: 'pi pi-copy',
      command: () => this.addFromProposal.emit(),
    },
  ];

  constructor() {
    console.log('[RecruitmentBatchHeader] menuItems:', this.menuItems);
  }

  onAddProposal(): void {
    this.addProposal.emit();
  }

  onAddDirect(): void {
    this.addDirect.emit();
  }

  onRemove(): void {
    console.log('Xóa đợt tuyển dụng');
  }
}
