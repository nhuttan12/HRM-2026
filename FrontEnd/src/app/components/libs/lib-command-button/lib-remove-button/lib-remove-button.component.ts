import { Component, input, output } from '@angular/core';
import { LibCommandButtonComponent } from '../lib-command-button.component';
import {
  LibCommandButtonSeverity,
  LibCommandButtonSize,
} from '../lib-command-button.model';

@Component({
  selector: 'lib-remove-button',
  standalone: true,
  imports: [LibCommandButtonComponent],
  templateUrl: './lib-remove-button.component.html',
})
export class LibRemoveButtonComponent {
  readonly label = input('Xóa');
  readonly icon = input('pi pi-trash');

  readonly severity = input<LibCommandButtonSeverity>('danger');

  readonly size = input<LibCommandButtonSize>('small');
  readonly disabled = input(false);
  readonly loading = input(false);

  readonly clicked = output<void>();
}