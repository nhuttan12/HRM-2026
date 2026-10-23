import { Component, input, output } from '@angular/core';
import { LibCommandButtonComponent } from '../lib-command-button.component';

@Component({
  selector: 'lib-save-button',
  standalone: true,
  imports: [LibCommandButtonComponent],
  templateUrl: './lib-save-button.component.html',
})
export class LibSaveButtonComponent {
  label = input('Lưu');
  icon = input('pi pi-save');
  disabled = input(false);
  loading = input(false);

  saveAction = output<void>();

  onSave(): void {
    this.saveAction.emit();
  }
}
