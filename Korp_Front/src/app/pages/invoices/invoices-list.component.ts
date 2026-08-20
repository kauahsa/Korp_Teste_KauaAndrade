import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { InvoiceService } from '../../core/services/invoice.service';
import { ToastService } from '../../core/services/toast.service';
import { Invoice } from '../../core/models/invoice.model';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { PrintModalComponent } from '../../shared/components/print-modal/print-modal.component';
import { DanfePreviewComponent } from '../../shared/components/danfe-preview/danfe-preview.component';

@Component({
  selector: 'app-invoices-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    IconComponent,
    PrintModalComponent,
    DanfePreviewComponent,
  ],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
              Notas Fiscais
            </h1>
            <span class="badge badge-info text-xs">
              {{ (filteredInvoices$ | async)?.length || 0 }} notas listadas
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            Controle de emissão sequencial, conferência de produtos e impressão com fechamento automático.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <a routerLink="/notas-fiscais/nova" class="btn btn-primary shadow-sm">
            <app-icon name="plus" [size]="18"></app-icon>
            <span>Nova Nota Fiscal</span>
          </a>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="card-surface p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        
        <!-- Status Filter Tabs -->
        <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full lg:w-auto">
          <button
            type="button"
            (click)="setStatusFilter('TODAS')"
            class="filter-tab"
            [class.active]="selectedStatusFilter === 'TODAS'"
          >
            Todas
          </button>
          <button
            type="button"
            (click)="setStatusFilter('Aberta')"
            class="filter-tab flex items-center gap-1.5"
            [class.active]="selectedStatusFilter === 'Aberta'"
          >
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Abertas</span>
            <span *ngIf="openCount$ | async as count" class="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 rounded-full font-bold">
              {{ count }}
            </span>
          </button>
          <button
            type="button"
            (click)="setStatusFilter('Fechada')"
            class="filter-tab flex items-center gap-1.5"
            [class.active]="selectedStatusFilter === 'Fechada'"
          >
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Fechadas</span>
            <span *ngIf="closedCount$ | async as count" class="text-[10px] bg-emerald-200/80 text-emerald-900 px-1.5 rounded-full font-bold">
              {{ count }}
            </span>
          </button>
        </div>

        <!-- Search Box -->
        <div class="input-search-wrapper w-full lg:w-80">
          <div class="search-icon">
            <app-icon name="search" [size]="16"></app-icon>
          </div>
          <input
            type="text"
            [formControl]="searchControl"
            placeholder="Buscar por número da nota..."
            class="form-control form-control-search text-sm"
          />
          <button
            *ngIf="searchControl.value"
            type="button"
            (click)="searchControl.setValue('')"
            class="clear-btn"
            title="Limpar busca"
          >
            <app-icon name="close" [size]="14"></app-icon>
          </button>
        </div>

      </div>

      <!-- Invoices Table -->
      <div class="card-surface overflow-hidden">
        <div class="custom-table-wrapper">
          <table class="custom-table">
            <thead>
              <tr>
                <th style="width: 20%">Numeração Sequencial</th>
                <th style="width: 40%">Itens e Produtos Incluídos</th>
                <th style="width: 15%">Status</th>
                <th style="width: 25%" class="text-right">Impressão / Ação</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let invoice of filteredInvoices$ | async">
                
                <!-- Numeração Sequencial -->
                <td>
                  <div class="font-mono font-extrabold text-brand-700 text-sm">
                    {{ invoice.number }}
                  </div>
                  <div class="text-[11px] text-slate-400 font-mono mt-0.5" *ngIf="invoice.issueDate">
                    Data: {{ invoice.issueDate | date: 'dd/MM/yyyy HH:mm' }}
                  </div>
                </td>

                <!-- Múltiplos Produtos / Quantidades -->
                <td>
                  <div class="text-xs font-semibold text-slate-800">
                    {{ invoice.totalQuantity }} unidade(s) no total ({{ invoice.items.length }} item(ns))
                  </div>
                  <div class="text-[11px] text-slate-500 mt-1 space-y-0.5">
                    <div *ngFor="let item of invoice.items" class="truncate">
                      • {{ item.productDescription }} (Qtd: <span class="font-bold">{{ item.quantity }}</span>)
                    </div>
                  </div>
                </td>

                <!-- Status da Nota Fiscal (Aberta / Fechada) -->
                <td>
                  <span
                    class="badge text-xs font-mono font-bold"
                    [ngClass]="invoice.status === 'Aberta' ? 'badge-open' : 'badge-closed'"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full mr-1.5"
                      [ngClass]="invoice.status === 'Aberta' ? 'bg-amber-500' : 'bg-emerald-500'"
                    ></span>
                    {{ invoice.status }}
                  </span>
                </td>

                <!-- Impressão e Ações -->
                <td class="text-right">
                  <div class="flex items-center justify-end gap-2">
                    
                    <!-- Botão de Impressão Visível e Intuitivo -->
                    <button
                      type="button"
                      *ngIf="invoice.status === 'Aberta'"
                      (click)="openPrintModal(invoice)"
                      class="btn btn-primary btn-sm shadow-xs hover:shadow-md"
                      title="Imprimir e fechar nota fiscal (debitando estoque)"
                    >
                      <app-icon name="printer" [size]="14"></app-icon>
                      <span>Imprimir Nota</span>
                    </button>

                    <!-- Botão para Notas Não Abertas (Fechadas) -->
                    <div *ngIf="invoice.status !== 'Aberta'" class="flex items-center gap-1">
                      <button
                        type="button"
                        (click)="viewDanfe(invoice)"
                        class="btn btn-secondary btn-sm"
                        title="Visualizar documento impresso"
                      >
                        <app-icon name="file-text" [size]="14"></app-icon>
                        <span>Visualizar</span>
                      </button>
                    </div>

                    <!-- Botão Excluir -->
                    <button
                      type="button"
                      (click)="confirmDelete(invoice)"
                      class="btn btn-ghost btn-sm p-1.5 text-slate-400 hover:text-rose-600"
                      title="Excluir nota fiscal"
                    >
                      <app-icon name="trash" [size]="15"></app-icon>
                    </button>
                  </div>
                </td>
              </tr>

              <tr *ngIf="(filteredInvoices$ | async)?.length === 0">
                <td colspan="4" class="text-center py-12 text-slate-400">
                  <div class="flex flex-col items-center justify-center">
                    <app-icon name="invoice" [size]="40" class="text-slate-300 mb-2"></app-icon>
                    <p class="font-medium text-slate-600">Nenhuma nota fiscal encontrada</p>
                    <p class="text-xs text-slate-400 mt-1">Clique em "Nova Nota Fiscal" para emitir uma nova nota.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Print Processing Modal -->
      <app-print-modal
        *ngIf="selectedInvoiceForPrint"
        [invoice]="selectedInvoiceForPrint"
        (closed)="onPrintModalClosed($event)"
      ></app-print-modal>

      <!-- View Document Modal -->
      <app-danfe-preview
        *ngIf="selectedInvoiceForDanfe"
        [invoice]="selectedInvoiceForDanfe"
        (closed)="selectedInvoiceForDanfe = null"
      ></app-danfe-preview>

    </div>
  `,
})
export class InvoicesListComponent implements OnInit {
  private invoiceService = inject(InvoiceService);
  private toast = inject(ToastService);

  public invoices$!: Observable<Invoice[]>;
  public filteredInvoices$!: Observable<Invoice[]>;
  public openCount$!: Observable<number>;
  public closedCount$!: Observable<number>;

  public searchControl = new FormControl('');
  public statusFilter$ = new BehaviorSubject<'TODAS' | 'Aberta' | 'Fechada'>('TODAS');

  public selectedInvoiceForPrint: Invoice | null = null;
  public selectedInvoiceForDanfe: Invoice | null = null;

  get selectedStatusFilter(): 'TODAS' | 'Aberta' | 'Fechada' {
    return this.statusFilter$.getValue();
  }

  ngOnInit(): void {
    this.invoices$ = this.invoiceService.invoices$;
    this.invoiceService.loadInitialInvoices();

    this.openCount$ = this.invoices$.pipe(
      map((invoices) => invoices.filter((i) => i.status === 'Aberta').length)
    );

    this.closedCount$ = this.invoices$.pipe(
      map((invoices) => invoices.filter((i) => i.status === 'Fechada').length)
    );

    const search$ = this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value || '')
    );

    this.filteredInvoices$ = combineLatest([
      this.invoices$,
      this.statusFilter$,
      search$,
    ]).pipe(
      map(([invoices, statusFilter, searchQuery]) => {
        let result = invoices;
        if (statusFilter !== 'TODAS') {
          result = result.filter((i) => i.status === statusFilter);
        }
        const query = (searchQuery || '').toLowerCase().trim();
        if (query) {
          result = result.filter(
            (i) =>
              i.number.toLowerCase().includes(query) ||
              i.items.some((item) => item.productDescription.toLowerCase().includes(query))
          );
        }
        return result;
      })
    );
  }

  public setStatusFilter(status: 'TODAS' | 'Aberta' | 'Fechada'): void {
    this.statusFilter$.next(status);
  }

  public openPrintModal(invoice: Invoice): void {
    if (invoice.status !== 'Aberta') {
      this.toast.error('Apenas notas fiscais com status "Aberta" podem ser impressas.');
      return;
    }
    this.selectedInvoiceForPrint = invoice;
  }

  public onPrintModalClosed(success: boolean): void {
    this.selectedInvoiceForPrint = null;
    if (success) {
      this.invoiceService.loadInitialInvoices();
    }
  }

  public viewDanfe(invoice: Invoice): void {
    this.selectedInvoiceForDanfe = invoice;
  }

  public confirmDelete(invoice: Invoice): void {
    if (confirm(`Tem certeza que deseja excluir a nota fiscal ${invoice.number}?`)) {
      this.invoiceService.deleteInvoice(invoice.id).subscribe({
        next: () => {
          this.toast.success(`Nota ${invoice.number} excluída.`);
        },
        error: (err) => {
          this.toast.error(err.message || 'Erro ao excluir nota fiscal.');
        },
      });
    }
  }
}
