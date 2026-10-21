import { Component, input, output, signal } from '@angular/core';
import { LibCloseButtonComponent } from '../lib-command-button/lib-close-button/lib-close-button.component';

@Component({
  selector: 'lib-canvas',
  standalone: true,
  templateUrl: './lib-canvas.component.html',
  imports: [LibCloseButtonComponent],
})
export class LibCanvasComponent {
  readonly title = input('Thông tin');
  readonly width = input('480px');

  readonly opened = signal(false);
  readonly closed = output<void>();

  private openFrameId: number | null = null;

  open(): void {
    if (this.opened() || this.openFrameId !== null) {
      return;
    }

    this.openFrameId = requestAnimationFrame(() => {
      this.openFrameId = null;
      this.opened.set(true);
    });
  }

  close(): void {
    if (this.openFrameId !== null) {
      cancelAnimationFrame(this.openFrameId);
      this.openFrameId = null;
    }

    const wasOpened = this.opened();
    this.opened.set(false);

    if (wasOpened) {
      this.closed.emit();
    }
  }

  onClose(): void {
    this.close();
  }
}