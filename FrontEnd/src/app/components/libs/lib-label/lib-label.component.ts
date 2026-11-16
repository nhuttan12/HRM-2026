import { Component, input } from '@angular/core';

export type LibLabelVariant = 'neutral' | 'success' | 'warning' | 'error';

@Component({
  selector: 'lib-label',
  standalone: true,
  templateUrl: './lib-label.component.html',
})
export class LibLabelComponent {
  readonly text = input('');
  readonly variant = input<LibLabelVariant>('neutral');
  readonly classes: Record<LibLabelVariant, string> = {
    neutral: 'bg-slate-100 text-slate-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
  };
}
