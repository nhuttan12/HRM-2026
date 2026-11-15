import { Component, inject } from '@angular/core';
import { LibToastService, ToastSeverity } from './lib-toast.service';
import { LibTextComponent } from '../lib-text/lib-text.component';

@Component({
  selector: 'lib-toast',
  standalone: true,
  imports: [LibTextComponent],
  templateUrl: './lib-toast.component.html',
})
export class LibToastComponent {
  readonly toastService = inject(LibToastService);

  readonly styles: Record<ToastSeverity, string> = {
    success: 'border-green-300 bg-green-50 text-green-800',
    warning: 'border-yellow-300 bg-yellow-50 text-yellow-800',
    error: 'border-red-300 bg-red-50 text-red-800',
  };

  readonly icons: Record<ToastSeverity, string> = {
    success: 'pi pi-check-circle',
    warning: 'pi pi-exclamation-triangle',
    error: 'pi pi-times-circle',
  };
}
