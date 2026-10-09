import { ChangeDetectorRef, Component, inject, input, output, signal } from '@angular/core';

@Component({
  selector: 'lib-canvas',
  standalone: true,
  templateUrl: './lib-canvas.component.html',
  styleUrl: './lib-canvas.component.scss',
})
export class LibCanvasComponent {
  readonly title = input('Thông tin');
  readonly width = input('480px');

  readonly opened = signal(false);
  readonly closed = output<void>();

  private readonly cdr = inject(ChangeDetectorRef);

  open(): void {
    this.opened.set(false);
    this.cdr.detectChanges();

    requestAnimationFrame(() => {
      this.opened.set(true);
    });
  }

  close(): void {
    this.opened.set(false);
    this.closed.emit();
  }

  onClose(): void {
    this.close();
  }
}