import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { ProductService } from '../../../core/services/product.service';
import { InvoiceService } from '../../../core/services/invoice.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <aside class="sidebar-container bg-white border-r border-slate-200 w-64 min-h-screen flex flex-col justify-between p-4 flex-shrink-0">
      <div class="space-y-6">
        
        <!-- Navigation Menu -->
        <div>
          <div class="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Módulos Principais
          </div>
          <nav class="space-y-1">
            <a
              routerLink="/dashboard"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              class="nav-link"
            >
              <app-icon name="dashboard" [size]="18"></app-icon>
              <span class="flex-1">Dashboard</span>
            </a>

            <a
              routerLink="/produtos"
              routerLinkActive="active"
              class="nav-link"
            >
              <app-icon name="package" [size]="18"></app-icon>
              <span class="flex-1">Cadastro de Produtos</span>
              <span *ngIf="totalProducts$ | async as total" class="badge-count">
                {{ total }}
              </span>
            </a>

            <a
              routerLink="/notas-fiscais"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              class="nav-link"
            >
              <app-icon name="invoice" [size]="18"></app-icon>
              <span class="flex-1">Notas Fiscais</span>
              <span *ngIf="openInvoicesCount$ | async as openCount" class="badge-open-count" [class.hidden]="openCount === 0">
                {{ openCount }} aberta{{ openCount > 1 ? 's' : '' }}
              </span>
            </a>

            <a
              routerLink="/notas-fiscais/nova"
              routerLinkActive="active"
              class="nav-link"
            >
              <app-icon name="plus" [size]="18"></app-icon>
              <span class="flex-1">Nova Nota Fiscal</span>
            </a>
          </nav>
        </div>

      </div>

      <!-- Footer Quick Status Card -->
      <div class="mt-auto pt-4 border-t border-slate-100">
        <div class="bg-slate-50 rounded-xl p-3 border border-slate-200/70">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span class="text-[11px] font-bold text-slate-700">Resumo do Estoque</span>
          </div>

          <div class="space-y-1.5 text-xs text-slate-600">
            <div class="flex justify-between">
              <span>Saldo Total:</span>
              <strong class="text-slate-900 font-mono">{{ totalStock$ | async }} un</strong>
            </div>
            <div class="flex justify-between">
              <span>NFs Emitidas:</span>
              <strong class="text-slate-900 font-mono">{{ totalInvoices$ | async }}</strong>
            </div>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [
    `
      .sidebar-container {
        display: flex;
        flex-direction: column;
      }

      .nav-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.625rem 0.75rem;
        border-radius: var(--radius-lg);
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--slate-600);
        text-decoration: none;
        transition: all var(--transition-fast);
      }

      .nav-link:hover {
        background-color: var(--slate-100);
        color: var(--slate-900);
      }

      .nav-link.active {
        background-color: var(--brand-50);
        color: var(--brand-700);
        font-weight: 600;
      }

      .badge-count {
        background: var(--slate-200);
        color: var(--slate-700);
        font-size: 0.6875rem;
        font-weight: 700;
        padding: 0.125rem 0.4375rem;
        border-radius: 9999px;
      }

      .badge-open-count {
        background: #fef08a;
        color: #854d0e;
        font-size: 0.6875rem;
        font-weight: 700;
        padding: 0.125rem 0.4375rem;
        border-radius: 9999px;
      }
    `,
  ],
})
export class SidebarComponent {
  private productService = inject(ProductService);
  private invoiceService = inject(InvoiceService);

  public totalProducts$ = this.productService.products$.pipe(map((list) => list.length));

  public totalStock$ = this.productService.products$.pipe(
    map((list) => list.reduce((acc, p) => acc + p.stock, 0))
  );

  public totalInvoices$ = this.invoiceService.invoices$.pipe(map((list) => list.length));

  public openInvoicesCount$ = this.invoiceService.invoices$.pipe(
    map((list) => list.filter((i) => i.status === 'Aberta').length)
  );
}
