import { Component, input, output } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'lib-dropdown-menu',
  standalone: true,
  imports: [],
  templateUrl: './lib-dropdown-menu.component.html',
})
export class LibDropdownMenuComponent {
  menuItems = input<MenuItem[]>([]);
  disabled = input(false);
  label = input<string>('');
  severity = input<
    'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast' | 'help' | undefined
  >('secondary');
  selected = output<MenuItem>();

  isOpen = false;

  onItemClick(item: MenuItem): void {
    item.command?.({ item, originalEvent: undefined as unknown as Event });
    this.selected.emit(item);
    this.isOpen = false;
  }

  toggle(): void {
    if (!this.disabled()) {
      this.isOpen = !this.isOpen;
    }
  }

  close(): void {
    this.isOpen = false;
  }
}
