import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  show: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toasts = signal<Toast[]>([]);
  private idCounter = 0;

  getToasts = this.toasts.asReadonly();

  success(title: string, message?: string, duration: number = 3000): void {
    this.addToast('success', title, message, duration);
  }

  error(title: string, message?: string, duration: number = 5000): void {
    this.addToast('error', title, message, duration);
  }

  warning(title: string, message?: string, duration: number = 4000): void {
    this.addToast('warning', title, message, duration);
  }

  info(title: string, message?: string, duration: number = 3000): void {
    this.addToast('info', title, message, duration);
  }

  remove(id: string): void {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  clearAll(): void {
    this.toasts.set([]);
  }

  private addToast(
    type: Toast['type'],
    title: string,
    message?: string,
    duration?: number
  ): void {
    const id = `toast-${++this.idCounter}-${Date.now()}`;
    const toast: Toast = {
      id,
      type,
      title,
      message,
      duration,
      show: true
    };

    this.toasts.update(toasts => [...toasts, toast]);

    if (duration && duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }
}
