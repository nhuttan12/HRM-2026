import { Injectable, signal } from '@angular/core';

export type ToastSeverity = 'success' | 'warning' | 'error';

export interface ToastMessage {
  id: number;
  severity: ToastSeverity;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class LibToastService {
  private readonly messages = signal<ToastMessage[]>([]);
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private nextId = 0;

  readonly toasts = this.messages.asReadonly();

  show(message: string, severity: ToastSeverity, duration = 5000): void {
    const id = ++this.nextId;
    this.messages.update((items) => [...items, { id, severity, message }]);
    if (duration > 0) {
      this.timers.set(id, setTimeout(() => this.dismiss(id), duration));
    }
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  dismiss(id: number): void {
    const timer = this.timers.get(id);
    if (timer !== undefined) clearTimeout(timer);
    this.timers.delete(id);
    this.messages.update((items) => items.filter((item) => item.id !== id));
  }
}
