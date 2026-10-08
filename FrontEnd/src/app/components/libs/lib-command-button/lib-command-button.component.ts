import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'lib-command-button',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './lib-command-button.component.html',
  styleUrl: './lib-command-button.component.scss',
})
export class LibCommandButtonComponent {
  label = input('');
  icon = input('');
  severity = input<
    | 'secondary'
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'contrast'
    | 'help'
    | undefined
  >();
  disabled = input(false);
  loading = input(false);
  
  clicked = output<void>();

  onClick(): void {
    this.clicked.emit();
  }
}