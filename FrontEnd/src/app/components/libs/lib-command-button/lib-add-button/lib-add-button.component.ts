import { Component, EventEmitter, Output } from '@angular/core';
import { LibCommandButtonComponent } from '../lib-command-button.component';

@Component({
  selector: 'lib-add-button',
  standalone: true,
  imports: [LibCommandButtonComponent],
  templateUrl: './lib-add-button.component.html',
})
export class LibAddButtonComponent {
  @Output() add = new EventEmitter<void>();

  onAdd(): void {
    this.add.emit();
  }
}