import { Component, input, output } from '@angular/core';
import { LibCommandButtonComponent } from '../lib-command-button.component';

@Component({
  selector: 'lib-remove-button',
  standalone: true,
  imports: [LibCommandButtonComponent],
  templateUrl: './lib-remove-button.component.html',
})
export class LibRemoveButtonComponent {
  readonly label = input('Xóa');
  readonly icon = input('pi pi-trash');

  readonly severity = input<
    'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast' | 'help' | undefined
  >('danger');

  readonly size = input<'small' | 'large' | undefined>('small');
  readonly disabled = input(false);
  readonly loading = input(false);

  readonly clicked = output<void>();
}