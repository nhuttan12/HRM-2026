import { Component, output } from '@angular/core';
import { LibCommandButtonComponent } from '../lib-command-button.component';

@Component({
  selector: 'lib-add-button',
  standalone: true,
  imports: [LibCommandButtonComponent],
  templateUrl: './lib-add-button.component.html',
})
export class LibAddButtonComponent {
  // Keep the public event name consistent with the other command buttons
  // and with all current consumers of this component.
  readonly addAction = output<void>();

  onAdd(): void {
    this.addAction.emit();
  }
}
