import { Component, input } from '@angular/core';
import { LibCommandButtonComponent } from '../lib-command-button.component';

@Component({
  selector: 'lib-remove-button',
  standalone: true,
  imports: [LibCommandButtonComponent],
  templateUrl: './lib-remove-button.component.html',
})
export class LibRemoveButtonComponent extends LibCommandButtonComponent {
  override readonly label = input('Xóa');
  override readonly icon = input('pi pi-trash');

  override readonly severity = input<
    'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast' | 'help' | undefined
  >('danger');

  override readonly size = input<'small' | 'large' | undefined>('small');
}
