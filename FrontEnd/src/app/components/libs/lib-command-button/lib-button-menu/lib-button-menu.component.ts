import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'lib-button-menu',
  standalone: true,
  imports: [ButtonModule, MenuModule],
  templateUrl: './lib-button-menu.component.html',
})
export class LibButtonMenuComponent {
  menuItems = input<MenuItem[]>([]);
  disabled = input(false);
  label = input<string>('');
  severity = input<
    'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast' | 'help' | undefined
  >('secondary');
  text = input<boolean>(true);
  selected = output<MenuItem>();

  onMenuItemClick(event: { item: MenuItem }): void {
    event.item.command?.(event);
    this.selected.emit(event.item);
  }
}
