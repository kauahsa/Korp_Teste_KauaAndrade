import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { InvoiceService } from '../../core/services/invoice.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { PrintModalComponent } from '../../shared/components/print-modal/print-modal.component';
import { DanfePreviewComponent } from '../../shared/components/danfe-preview/danfe-preview.component';
import { Invoice } from '../../core/models/invoice.model';
import { Product } from '../../core/models/product.model';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  totalInvoices: number;
  openInvoices: number;
  closedInvoices: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent, PrintModalComponent, DanfePreviewComponent],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Welcome Banner -->
      <div class="bg-gradient-to-r from-slate-900 via-brand-950 to-brand-900 rounded-2xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2 max-w-2xl">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/30 text-brand-200 border border-brand-400/30">
                Sistema Operacional
              </span>
              <span class="text-xs text-slate-300">Microsserviços de Faturamento & Estoque</span>
            </div>
            <h1 class="text-2xl lg:text-3xl font-extrabold tracking-tight text-white font-display">
              Controle de Notas Fiscais & Estoque
            </h1>
            <p class="text-sm text-slate-300 leading-relaxed">
              Cadastro de produtos com saldo, emissão de notas fiscais sequenciais e baixa de estoque automática na impressão.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <a routerLink="/notas-fiscais/nova" class="btn btn-primary bg-brand-500 hover:bg-brand-400 border-none shadow-md">
              <app-icon name="plus" [size]="18"></app-icon>
              <span>Emitir Nota Fiscal</span>
            </a>
            <a routerLink="/produtos" class="btn bg-white/10 hover:bg-white/20 text-white border-white/20">
              <app-icon name="package" [size]="18"></app-icon>
              <span>Gerenciar Produtos</span>
            </a>
          </div>
        </div>
      </div>

      <!-- KPI Metric Cards Grid -->
      <ng-container *ngIf="stats$ | async as stats">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <!-- Total Products -->
          <div class="card-surface p-5 flex items-start justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Produtos Cadastrados</p>
              <h3 class="text-2xl font-black text-slate-900 font-mono">{{ stats.totalProducts }}</h3>
              <p class="text-xs text-slate-500 mt-2">
                Itens disponíveis
              </p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <app-icon name="package" [size]="24"></app-icon>
            </div>
          </div>

          <!-- Total Stock -->
          <div class="card-surface p-5 flex items-start justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Saldo Total em Estoque</p>
              <h3 class="text-2xl font-black text-brand-700 font-mono">{{ stats.totalStock }}</h3>
              <p class="text-xs text-slate-500 mt-2">
                Unidades físicas
              </p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <app-icon name="layers" [size]="24"></app-icon>
            </div>
          </div>

          <!-- Open Invoices -->
          <div class="card-surface p-5 flex items-start justify-between border-amber-200/80 bg-amber-50/20">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">Notas Abertas</p>
              <div class="flex items-center gap-2">
                <h3 class="text-2xl font-black text-amber-900 font-mono">{{ stats.openInvoices }}</h3>
                <span *ngIf="stats.openInvoices > 0" class="badge badge-open text-[10px]">
                  Aguardando Impressão
                </span>
              </div>
              <p class="text-xs text-amber-700/80 mt-2">
                Saldo ainda não debitado
              </p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <app-icon name="clock" [size]="24"></app-icon>
            </div>
          </div>

          <!-- Closed Invoices -->
          <div class="card-surface p-5 flex items-start justify-between border-emerald-200/80 bg-emerald-50/20">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">Notas Fechadas</p>
              <h3 class="text-2xl font-black text-emerald-900 font-mono">{{ stats.closedInvoices }}</h3>
              <p class="text-xs text-emerald-700/80 mt-2 flex items-center gap-1">
                <span>Impressas & Saldo baixado</span>
              </p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <app-icon name="check" [size]="24"></app-icon>
            </div>
          </div>

        </div>
      </ng-container>

      <!-- Grid: Recent Invoices & Products -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left: Recent Invoices (2 cols) -->
        <div class="lg:col-span-2 card-surface p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-lg font-bold text-slate-900">Últimas Notas Fiscais</h2>
              <p class="text-xs text-slate-500">Acompanhamento de status e impressão</p>
            </div>
            <a routerLink="/notas-fiscais" class="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1">
              <span>Ver todas</span>
              <app-icon name="arrow-right" [size]="14"></app-icon>
            </a>
          </div>

          <div class="custom-table-wrapper">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Itens</th>
                  <th>Status</th>
                  <th class="text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let invoice of recentInvoices$ | async">
                  <td>
                    <div class="font-mono font-bold text-slate-900 text-xs">{{ invoice.number }}</div>
                    <div class="text-[10px] text-slate-400 font-mono" *ngIf="invoice.issueDate">
                      {{ invoice.issueDate | date: 'dd/MM/yyyy HH:mm' }}
                    </div>
                  </td>
                  <td>
                    <span class="text-xs font-semibold text-slate-800">
                      {{ invoice.totalQuantity }} un ({{ invoice.items.length }} produtos)
                    </span>
                  </td>
                  <td>
                    <span
                      class="badge text-[11px] font-mono font-bold"
                      [ngClass]="invoice.status === 'Aberta' ? 'badge-open' : 'badge-closed'"
                    >
                      {{ invoice.status }}
                    </span>
                  </td>
                  <td class="text-right">
                    <button
                      *ngIf="invoice.status === 'Aberta'"
                      type="button"
                      (click)="selectedInvoiceForPrint = invoice"
                      class="btn btn-primary btn-xs"
                    >
                      <app-icon name="printer" [size]="13"></app-icon>
                      <span>Imprimir</span>
                    </button>
                    <button
                      *ngIf="invoice.status === 'Fechada'"
                      type="button"
                      (click)="selectedInvoiceForDanfe = invoice"
                      class="btn btn-ghost btn-xs text-slate-500"
                    >
                      <app-icon name="file-text" [size]="13"></app-icon>
                      <span>Ver</span>
                    </button>
                  </td>
                </tr>
                <tr *ngIf="(recentInvoices$ | async)?.length === 0">
                  <td colspan="4" class="text-center py-6 text-slate-400 text-xs">
                    Nenhuma nota fiscal emitida ainda.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Right: Recent Products & Stock -->
        <div class="card-surface p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-lg font-bold text-slate-900">Estoque de Produtos</h2>
              <p class="text-xs text-slate-500">Saldos disponíveis em tempo real</p>
            </div>
            <a routerLink="/produtos" class="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1">
              <span>Ver todos</span>
              <app-icon name="arrow-right" [size]="14"></app-icon>
            </a>
          </div>

          <div class="space-y-3">
            <div
              *ngFor="let prod of recentProducts$ | async"
              class="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50"
            >
              <div>
                <span class="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200/60">
                  {{ prod.code }}
                </span>
                <div class="text-xs font-bold text-slate-900 mt-1 truncate max-w-[170px]">{{ prod.description }}</div>
              </div>
              <div class="text-right">
                <span
                  class="inline-block font-mono font-bold text-xs px-2.5 py-1 rounded-full"
                  [ngClass]="prod.stock > 0 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'"
                >
                  {{ prod.stock }} un
                </span>
              </div>
            </div>

            <div *ngIf="(recentProducts$ | async)?.length === 0" class="text-center py-6 text-slate-400 text-xs">
              Nenhum produto cadastrado.
            </div>
          </div>
        </div>

      </div>

      <!-- Modals -->
      <app-print-modal
        *ngIf="selectedInvoiceForPrint"
        [invoice]="selectedInvoiceForPrint"
        (closed)="onPrintModalClosed($event)"
      ></app-print-modal>

      <app-danfe-preview
        *ngIf="selectedInvoiceForDanfe"
        [invoice]="selectedInvoiceForDanfe"
        (closed)="selectedInvoiceForDanfe = null"
      ></app-danfe-preview>

    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private invoiceService = inject(InvoiceService);

  public stats$!: Observable<DashboardStats>;
  public recentInvoices$!: Observable<Invoice[]>;
  public recentProducts$!: Observable<Product[]>;

  public selectedInvoiceForPrint: Invoice | null = null;
  public selectedInvoiceForDanfe: Invoice | null = null;

  ngOnInit(): void {
    this.productService.loadInitialData();
    this.invoiceService.loadInitialInvoices();

    this.recentProducts$ = this.productService.products$.pipe(
      map((products) => products.slice(0, 5))
    );

    this.recentInvoices$ = this.invoiceService.invoices$.pipe(
      map((invoices) => invoices.slice(0, 5))
    );

    this.stats$ = combineLatest([
      this.productService.products$,
      this.invoiceService.invoices$,
    ]).pipe(
      map(([products, invoices]) => {
        const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
        const openInvoices = invoices.filter((i) => i.status === 'Aberta').length;
        const closedInvoices = invoices.filter((i) => i.status === 'Fechada').length;

        return {
          totalProducts: products.length,
          totalStock,
          totalInvoices: invoices.length,
          openInvoices,
          closedInvoices,
        };
      })
    );
  }

  public onPrintModalClosed(success: boolean): void {
    this.selectedInvoiceForPrint = null;
    if (success) {
      this.productService.loadInitialData();
      this.invoiceService.loadInitialInvoices();
    }
  }
}
