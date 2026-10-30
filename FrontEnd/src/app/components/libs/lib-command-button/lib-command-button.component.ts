import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import {
  LibCommandButtonSeverity,
  LibCommandButtonSize,
} from './lib-command-button.model';

@Component({
  selector: 'lib-command-button',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './lib-command-button.component.html',
})
export class LibCommandButtonComponent {
  label = input('');
  icon = input('');
  severity = input<LibCommandButtonSeverity>();
  size = input<LibCommandButtonSize>('small');
  disabled = input(false);
  loading = input(false);
  
  clicked = output<void>();

  onClick(): void {
    this.clicked.emit();
  }
}