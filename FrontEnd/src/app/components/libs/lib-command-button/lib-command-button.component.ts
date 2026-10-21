import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'lib-command-button',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './lib-command-button.component.html',
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
  size = input<'small' | 'large' | undefined>('small');
  disabled = input(false);
  loading = input(false);
  
  clicked = output<void>();

  onClick(): void {
    this.clicked.emit();
  }
}