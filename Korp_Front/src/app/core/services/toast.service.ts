import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Toast, ToastType } from '../models/toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

  public show(type: ToastType, title: string, message?: string, duration = 4500): void {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    const toast: Toast = {
      id,
      type,
      title: title || 'Notificação',
      message: message || '',
      duration,
    };

    const current = this.toastsSubject.getValue();
    this.toastsSubject.next([...current, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  public success(title: string, message?: string, duration = 4500): void {
    this.show('success', title, message, duration);
  }

  public error(title: string, message?: string, duration = 5000): void {
    this.show('danger', title, message, duration);
  }

  public danger(title: string, message?: string, duration = 5000): void {
    this.show('danger', title, message, duration);
  }

  public warning(title: string, message?: string, duration = 5000): void {
    this.show('warning', title, message, duration);
  }

  public info(title: string, message?: string, duration = 4000): void {
    this.show('info', title, message, duration);
  }

  public remove(id: string): void {
    const current = this.toastsSubject.getValue();
    this.toastsSubject.next(current.filter((t) => t.id !== id));
  }
}
