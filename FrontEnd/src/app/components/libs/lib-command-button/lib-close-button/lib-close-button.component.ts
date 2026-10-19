import { Component, input, output } from '@angular/core';
import { LibCommandButtonComponent } from '../lib-command-button.component';

@Component({
  selector: 'lib-close-button',
  standalone: true,
  imports: [LibCommandButtonComponent],
  templateUrl: './lib-close-button.component.html',
})
export class LibCloseButtonComponent {
  readonly size = input<'small' | 'large' | undefined>();
  readonly closed = output<void>();

  onClose(): void {
    this.closed.emit();
  }
}
