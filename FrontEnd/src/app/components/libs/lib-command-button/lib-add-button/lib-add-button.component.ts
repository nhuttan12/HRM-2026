import { Component, output } from '@angular/core';
import { LibCommandButtonComponent } from '../lib-command-button.component';

@Component({
  selector: 'lib-add-button',
  standalone: true,
  imports: [LibCommandButtonComponent],
  templateUrl: './lib-add-button.component.html',
})
export class LibAddButtonComponent {
  readonly add = output<void>();

  onAdd(): void {
    this.add.emit();
  }
}