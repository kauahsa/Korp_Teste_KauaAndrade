import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { ProductService } from '../../../core/services/product.service';
import { InvoiceService } from '../../../core/services/invoice.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <header class="glass-header sticky top-0 z-40 px-4 lg:px-8 py-3 flex items-center justify-between shadow-xs">
      <!-- Left: Logo & Brand -->
      <div class="flex items-center gap-4">
        <a routerLink="/" class="flex items-center gap-3 no-underline group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white font-extrabold text-lg shadow-sm group-hover:scale-105 transition-transform">
            K
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-lg tracking-tight text-slate-900 font-display">Korp Fiscal</span>
              <span class="badge badge-info text-[10px] py-0.5 px-2 font-bold uppercase">v2.5</span>
            </div>
            <p class="text-[11px] text-slate-500 font-medium">Sistema de Emissão de Notas Fiscais & Estoque</p>
          </div>
        </a>
      </div>

      <!-- Center: Navigation Links -->
      <nav class="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
        <a
          routerLink="/dashboard"
          routerLinkActive="bg-white text-brand-700 shadow-xs font-semibold"
          [routerLinkActiveOptions]="{ exact: true }"
          class="px-3.5 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-900 transition-all flex items-center gap-1.5"
        >
          <app-icon name="dashboard" [size]="15"></app-icon>
          <span>Dashboard</span>
        </a>

        <a
          routerLink="/produtos"
          routerLinkActive="bg-white text-brand-700 shadow-xs font-semibold"
          class="px-3.5 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-900 transition-all flex items-center gap-1.5"
        >
          <app-icon name="package" [size]="15"></app-icon>
          <span>Cadastro de Produtos</span>
        </a>

        <a
          routerLink="/notas-fiscais"
          routerLinkActive="bg-white text-brand-700 shadow-xs font-semibold"
          class="px-3.5 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-900 transition-all flex items-center gap-1.5"
        >
          <app-icon name="invoice" [size]="15"></app-icon>
          <span>Notas Fiscais</span>
        </a>
      </nav>

      <!-- Right: Action Buttons -->
      <div class="flex items-center gap-2.5">
        <a
          routerLink="/notas-fiscais/nova"
          class="btn btn-primary btn-sm flex items-center gap-1.5 shadow-sm"
        >
          <app-icon name="plus" [size]="15"></app-icon>
          <span class="hidden sm:inline">Nova Nota Fiscal</span>
        </a>

        <button
          type="button"
          (click)="refreshData()"
          class="btn btn-secondary btn-sm text-slate-600"
          title="Recarregar dados do backend"
        >
          <app-icon name="refresh" [size]="14"></app-icon>
          <span class="hidden xl:inline text-xs">Atualizar</span>
        </button>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  private productService = inject(ProductService);
  private invoiceService = inject(InvoiceService);
  private toastService = inject(ToastService);

  public refreshData(): void {
    this.productService.loadInitialData();
    this.invoiceService.loadInitialInvoices();
    this.toastService.info('Dados Atualizados', 'Sincronizado com os microsserviços do backend.');
  }
}
