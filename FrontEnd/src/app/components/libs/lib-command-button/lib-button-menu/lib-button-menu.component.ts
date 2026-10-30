import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MenuItem } from 'primeng/api';
import { SelectChangeEvent } from 'primeng/types/select';

@Component({
  selector: 'lib-button-menu',
  standalone: true,
  imports: [SelectModule, ReactiveFormsModule],
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
  placeholder = input<string>('');
  formControl = input<FormControl>(null as unknown as FormControl);
  selected = output<MenuItem>();

  onSelectChange(event: SelectChangeEvent): void {
    const item = event.value as MenuItem;
    item?.command?.({ item, originalEvent: event.originalEvent });
    this.selected.emit(item);
  }
}
