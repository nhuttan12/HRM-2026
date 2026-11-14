import { Component, input, output } from '@angular/core';
import { LibTextComponent } from '../../lib-text/lib-text.component';

@Component({
  selector: 'lib-sidebar-menu-item',
  standalone: true,
  imports: [LibTextComponent],
  templateUrl: './lib-sidebar-menu-item.component.html',
})
export class LibSidebarMenuItemComponent {
  label = input('');
  icon = input<string>();
  active = input(false);
  disabled = input(false);
  selected = output<void>();

  onClick(): void {
    if (!this.disabled()) this.selected.emit();
  }
}