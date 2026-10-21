import { Component, input, output } from '@angular/core';
import { LibCommandButtonComponent } from '../lib-command-button.component';

@Component({
  selector: 'lib-edit-button',
  standalone: true,
  imports: [LibCommandButtonComponent],
  templateUrl: './lib-edit-button.component.html',
})
export class LibEditButtonComponent {
  readonly label = input('');
  readonly icon = input('pi pi-pencil');

  readonly severity = input<
    'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast' | 'help' | undefined
  >('secondary');

  readonly size = input<'small' | 'large' | undefined>('small');
  readonly disabled = input(false);
  readonly loading = input(false);

  readonly editAction = output<void>();
}