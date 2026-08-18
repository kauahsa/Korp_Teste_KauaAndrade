import { Component, Input, Output, EventEmitter, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Invoice } from '../../../core/models/invoice.model';
import { InvoiceService } from '../../../core/services/invoice.service';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../icon/icon.component';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-print-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        
        <!-- Header -->
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
              <app-icon name="printer" [size]="22"></app-icon>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">Impressão de Nota Fiscal</h3>
              <p class="text-xs text-slate-500 font-mono">{{ invoice?.number }}</p>
            </div>
          </div>

          <button
            type="button"
            (click)="handleClose()"
            class="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition-colors"
          >
            <app-icon name="x" [size]="18"></app-icon>
          </button>
        </div>

        <!-- Body Content -->
        <div class="p-6">

          <!-- Processing State -->
          <div *ngIf="step === 'processing'" class="flex flex-col items-center text-center py-4">
            
            <!-- Animated Spinner -->
            <div class="relative w-20 h-20 mb-6 flex items-center justify-center">
              <div class="absolute inset-0 rounded-full border-4 border-brand-100 animate-ping opacity-25"></div>
              <div class="w-16 h-16 rounded-full border-4 border-brand-500 border-t-transparent animate-spin"></div>
              <div class="absolute">
                <app-icon name="printer" [size]="24" extraClass="text-brand-600"></app-icon>
              </div>
            </div>

            <h4 class="text-base font-bold text-slate-900 mb-1">{{ currentStepText }}</h4>
            <p class="text-xs text-slate-500 max-w-xs mb-6">
              Comunicando com o microsserviço de Estoque para validar saldos e debitar itens...
            </p>

            <!-- Progress Bar -->
            <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-2">
              <div
                class="bg-brand-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                [style.width.%]="progress"
              ></div>
            </div>
            <div class="flex justify-between w-full text-[11px] text-slate-400 font-mono">
              <span>Processando...</span>
              <span>{{ progress }}%</span>
            </div>
          </div>

          <!-- Completed State -->
          <div *ngIf="step === 'completed'" class="py-2 animate-fade-in">
            <div class="flex flex-col items-center text-center mb-6">
              <div class="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                <app-icon name="check" [size]="36"></app-icon>
              </div>
              <h4 class="text-lg font-extrabold text-slate-900">Nota Fiscal Impressa e Fechada!</h4>
              <p class="text-xs text-slate-500 max-w-sm mt-1">
                O status da <span class="font-bold text-slate-700">{{ invoice?.number }}</span> foi atualizado para
                <span class="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Fechada</span>
                e o saldo dos produtos foi debitado no estoque.
              </p>
            </div>

            <!-- Deducted Products Stock Summary Box -->
            <div class="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6">
              <div class="flex items-center justify-between mb-3 border-b border-slate-200/80 pb-2">
                <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  📦 Saldo Debitado no Estoque
                </span>
                <span class="text-[11px] text-slate-500 font-mono">{{ invoice?.items?.length }} produto(s)</span>
              </div>

              <div class="space-y-2 max-h-44 overflow-y-auto pr-1">
                <div
                  *ngFor="let item of invoice?.items"
                  class="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-100"
                >
                  <div class="min-w-0 pr-2">
                    <span class="font-mono font-bold text-brand-700">{{ item.productCode }}</span>
                    <span class="text-slate-700 ml-1.5 truncate block">{{ item.productDescription }}</span>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <span class="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded font-mono">
                      -{{ item.quantity }} un
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                (click)="handleClose()"
                class="btn btn-primary w-full py-3 text-sm font-bold shadow-md"
              >
                Concluir
              </button>
            </div>
          </div>

          <!-- Error State -->
          <div *ngIf="step === 'error'" class="py-4 text-center animate-fade-in">
            <div class="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mx-auto mb-4">
              <app-icon name="alert-triangle" [size]="36"></app-icon>
            </div>
            <h4 class="text-base font-bold text-slate-900 mb-2">Falha no Processamento da Nota</h4>
            <div class="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl mb-6 text-left">
              {{ errorMessage }}
            </div>
            <button type="button" class="btn btn-secondary w-full py-2.5 text-sm" (click)="handleClose()">
              Fechar
            </button>
          </div>

        </div>

      </div>
    </div>
  `,
})
export class PrintModalComponent implements OnInit {
  @Input() invoice: Invoice | null = null;
  @Output() closed = new EventEmitter<boolean>();

  private invoiceService = inject(InvoiceService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  public step: 'processing' | 'completed' | 'error' = 'processing';
  public progress = 30;
  public currentStepText = 'Validando dados da nota e produtos...';
  public errorMessage = '';

  ngOnInit(): void {
    if (!this.invoice) {
      this.step = 'error';
      this.errorMessage = 'Nenhuma nota informada para processamento.';
      this.cdr.detectChanges();
      return;
    }

    if (this.invoice.status !== 'Aberta') {
      this.step = 'error';
      this.errorMessage = 'Não é permitido imprimir notas fiscais com status diferente de "Aberta".';
      this.cdr.detectChanges();
      return;
    }

    this.startPrintingWorkflow();
  }

  private startPrintingWorkflow(): void {
    this.progress = 60;
    this.currentStepText = 'Validando e debitando saldo no Estoque...';
    this.cdr.detectChanges();

    if (!this.invoice) return;

    this.invoiceService.processAndPrintInvoice(this.invoice.id).subscribe({
      next: (updatedInvoice) => {
        this.invoice = updatedInvoice;
        this.progress = 100;
        this.step = 'completed';
        this.cdr.detectChanges();

        this.triggerConfetti();

        this.toastService.success(
          `A nota ${updatedInvoice.number} foi emitida e o saldo do estoque atualizado com sucesso!`
        );
      },
      error: (err) => {
        this.step = 'error';
        this.errorMessage = err.message || 'Erro ao processar a nota fiscal.';
        this.cdr.detectChanges();
        this.toastService.error(this.errorMessage);
      },
    });
  }

  private triggerConfetti(): void {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  }

  public handleClose(): void {
    this.closed.emit(this.step === 'completed');
  }
}
