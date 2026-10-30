import { Component, input, output } from '@angular/core';
import { LibCommandButtonComponent } from '../lib-command-button.component';
import {
  LibCommandButtonSeverity,
  LibCommandButtonSize,
} from '../lib-command-button.model';

@Component({
  selector: 'lib-edit-button',
  standalone: true,
  imports: [LibCommandButtonComponent],
  templateUrl: './lib-edit-button.component.html',
})
export class LibEditButtonComponent {
  readonly label = input('');
  readonly icon = input('pi pi-pencil');

  readonly severity = input<LibCommandButtonSeverity>('secondary');

  readonly size = input<LibCommandButtonSize>('small');
  readonly disabled = input(false);
  readonly loading = input(false);

  readonly editAction = output<void>();
}