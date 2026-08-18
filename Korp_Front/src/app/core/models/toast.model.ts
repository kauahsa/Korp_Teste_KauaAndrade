export type ToastType = 'success' | 'danger' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number; // em milissegundos (default: 4000)
}
