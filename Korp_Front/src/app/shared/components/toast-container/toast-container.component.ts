import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="toast-wrapper fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full p-4">
      <div
        *ngFor="let toast of toastService.toasts$ | async"
        class="toast-item pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-slide-in"
        [ngClass]="{
          'bg-emerald-50/95 border-emerald-200 text-emerald-900': toast.type === 'success',
          'bg-rose-50/95 border-rose-200 text-rose-900': toast.type === 'danger',
          'bg-amber-50/95 border-amber-200 text-amber-900': toast.type === 'warning',
          'bg-sky-50/95 border-sky-200 text-sky-900': toast.type === 'info'
        }"
      >
        <!-- Icon -->
        <div class="mt-0.5 flex-shrink-0">
          <app-icon
            [name]="
              toast.type === 'success'
                ? 'check-circle'
                : toast.type === 'danger'
                ? 'alert-triangle'
                : toast.type === 'warning'
                ? 'clock'
                : 'info'
            "
            [size]="20"
            [extraClass]="
              toast.type === 'success'
                ? 'text-emerald-600'
                : toast.type === 'danger'
                ? 'text-rose-600'
                : toast.type === 'warning'
                ? 'text-amber-600'
                : 'text-sky-600'
            "
          ></app-icon>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-bold tracking-tight mb-0.5">{{ toast.title }}</h4>
          <p class="text-xs text-slate-700 leading-relaxed">{{ toast.message }}</p>
        </div>

        <!-- Close Button -->
        <button
          type="button"
          (click)="toastService.remove(toast.id)"
          class="flex-shrink-0 text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
          title="Fechar"
        >
          <app-icon name="close" [size]="14"></app-icon>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .toast-wrapper {
        position: fixed;
        top: 1.25rem;
        right: 1.25rem;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
        pointer-events: none;
        max-width: 24rem;
        width: 100%;
      }

      .toast-item {
        pointer-events: auto;
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 0.875rem 1rem;
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      @keyframes toastSlideIn {
        from {
          opacity: 0;
          transform: translateX(30px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }
    `,
  ],
})
export class ToastContainerComponent {
  public toastService = inject(ToastService);
}
