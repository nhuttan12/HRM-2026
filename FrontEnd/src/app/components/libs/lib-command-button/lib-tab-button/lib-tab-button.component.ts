import { Component, computed, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LibCommandButtonComponent } from '../lib-command-button.component';

@Component({
  selector: 'lib-tab-button',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './lib-tab-button.component.html',
})
export class LibTabButtonComponent extends LibCommandButtonComponent {
  readonly active = input(false);

  readonly tabClass = computed(
    () =>
      `inline-flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
        this.active()
          ? 'border-primary text-primary'
          : 'border-transparent text-gray-600 hover:text-gray-900'
      }`,
  );
}
