import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Invoice } from '../../../core/models/invoice.model';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-danfe-preview',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in" *ngIf="invoice">
      <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        <!-- Top Action Bar (hidden when printing) -->
        <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
              <app-icon name="invoice" [size]="20"></app-icon>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">Nota Fiscal — {{ invoice.number }}</h3>
              <p class="text-xs text-slate-500">Documento de Emissão Fiscal</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              *ngIf="invoice.status === 'Aberta'"
              type="button"
              class="btn btn-primary btn-sm"
              (click)="printDocument()"
              title="Imprimir documento"
            >
              <app-icon name="printer" [size]="16"></app-icon>
              <span>Imprimir Documento</span>
            </button>
            <button
              *ngIf="invoice.status !== 'Aberta'"
              type="button"
              class="btn btn-secondary btn-sm opacity-60 cursor-not-allowed text-slate-500 border-slate-300"
              disabled
              title="Impressão bloqueada: a nota fiscal possui status diferente de Aberta"
            >
              <app-icon name="printer" [size]="16"></app-icon>
              <span>Impressão Bloqueada</span>
            </button>
            <button type="button" class="btn btn-ghost btn-sm" (click)="closed.emit()">
              <app-icon name="x" [size]="18"></app-icon>
            </button>
          </div>
        </div>

        <!-- Scrollable Document Container -->
        <div class="p-8 overflow-y-auto flex-1 bg-white space-y-6 text-slate-800 font-sans">
          
          <!-- Document Header -->
          <div class="border-2 border-slate-900 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div class="text-xs font-bold uppercase tracking-widest text-slate-500">Sistema de Faturamento Korp</div>
              <h1 class="text-2xl font-black text-slate-900 font-mono">NOTA FISCAL Nº {{ invoice.number }}</h1>
              <p class="text-xs text-slate-600 mt-0.5" *ngIf="invoice.issueDate">
                Data de Registro: {{ invoice.issueDate | date: 'dd/MM/yyyy HH:mm:ss' }}
              </p>
            </div>

            <div class="text-right">
              <span
                class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono border"
                [ngClass]="invoice.status === 'Fechada' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'"
              >
                STATUS: {{ invoice.status }}
              </span>
            </div>
          </div>

          <!-- Items Table -->
          <div>
            <h2 class="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
              Produtos da Nota Fiscal
            </h2>
            <table class="w-full text-left border-collapse border border-slate-300 text-xs">
              <thead>
                <tr class="bg-slate-100 border-b border-slate-300 text-slate-800 uppercase font-bold">
                  <th class="p-2.5 border-r border-slate-300" style="width: 20%">Código</th>
                  <th class="p-2.5 border-r border-slate-300" style="width: 60%">Descrição do Produto</th>
                  <th class="p-2.5 text-center" style="width: 20%">Quantidade</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of invoice.items" class="border-b border-slate-200">
                  <td class="p-2.5 border-r border-slate-200 font-mono font-bold">{{ item.productCode }}</td>
                  <td class="p-2.5 border-r border-slate-200">{{ item.productDescription }}</td>
                  <td class="p-2.5 text-center font-bold font-mono">{{ item.quantity }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="bg-slate-50 font-bold">
                  <td colspan="2" class="p-2.5 text-right border-r border-slate-300">TOTAL DE PEÇAS:</td>
                  <td class="p-2.5 text-center font-mono font-black text-sm">{{ invoice.totalQuantity }}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Footer Verification -->
          <div class="pt-4 border-t border-slate-200 text-[11px] text-slate-500 text-center">
            Documento gerado pelo Sistema de Faturamento & Estoque Korp • Desenvolvido com Angular & C# ASP.NET Core
          </div>

        </div>

      </div>
    </div>
  `,
})
export class DanfePreviewComponent {
  @Input() invoice: Invoice | null = null;
  @Output() closed = new EventEmitter<void>();

  private toast = inject(ToastService);

  public printDocument(): void {
    if (this.invoice?.status !== 'Aberta') {
      this.toast.error('Apenas notas fiscais com status "Aberta" podem ser impressas.');
      return;
    }
    window.print();
  }
}
