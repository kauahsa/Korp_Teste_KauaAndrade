import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { InvoiceService } from '../../core/services/invoice.service';
import { ToastService } from '../../core/services/toast.service';
import { Product } from '../../core/models/product.model';
import { CreateInvoiceDto } from '../../core/models/invoice.model';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-invoice-create',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, IconComponent],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto animate-fade-in pb-12">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <a routerLink="/notas-fiscais" class="text-slate-400 hover:text-slate-700 transition-colors">
              <app-icon name="arrow-right" [size]="18" extraClass="rotate-180"></app-icon>
            </a>
            <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
              Emissão de Nova Nota Fiscal
            </h1>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            Selecione múltiplos produtos cadastrados e informe as quantidades para criar a Nota Fiscal.
          </p>
        </div>

        <!-- Status Badges -->
        <div class="flex items-center gap-3">
          <div class="bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl text-right">
            <span class="text-[10px] text-amber-700 uppercase font-bold block">Status Inicial</span>
            <span class="badge badge-open text-xs font-bold font-mono">Aberta</span>
          </div>
        </div>
      </div>

      <form [formGroup]="invoiceForm" (ngSubmit)="saveInvoice()" class="space-y-6">
        
        <!-- Products Selection Section -->
        <div class="card-surface p-6">
          <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                <app-icon name="package" [size]="16"></app-icon>
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900">Inclusão de Produtos da Nota Fiscal</h3>
                <p class="text-[11px] text-slate-500">Adicione os produtos com suas respectivas quantidades</p>
              </div>
            </div>

            <button
              type="button"
              (click)="addItemRow()"
              class="btn btn-secondary btn-sm"
              [disabled]="(products$ | async)?.length === 0"
            >
              <app-icon name="plus" [size]="14"></app-icon>
              <span>Adicionar Outro Produto</span>
            </button>
          </div>

          <!-- Items FormArray -->
          <div formArrayName="items" class="space-y-3">
            <div
              *ngFor="let itemGroup of itemsFormArray.controls; let i = index"
              [formGroupName]="i"
              class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col md:flex-row items-center gap-4"
            >
              <!-- Item Index -->
              <div class="w-7 h-7 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center font-mono shrink-0">
                {{ i + 1 }}
              </div>

              <!-- Product Select -->
              <div class="w-full md:flex-1">
                <label class="form-label text-xs">Produto <span class="text-rose-500 font-bold">*</span></label>
                <select
                  formControlName="productId"
                  class="form-control text-sm"
                  (change)="onProductChange(i)"
                >
                  <option value="" disabled>Selecione um produto cadastrado...</option>
                  <option *ngFor="let prod of products$ | async" [value]="prod.id">
                    [{{ prod.code }}] {{ prod.description }} — Saldo: {{ prod.stock }} un
                  </option>
                </select>
              </div>

              <!-- Quantity Input -->
              <div class="w-full md:w-36">
                <label class="form-label text-xs">Quantidade <span class="text-rose-500 font-bold">*</span></label>
                <input
                  type="number"
                  formControlName="quantity"
                  min="1"
                  placeholder="1"
                  class="form-control font-mono text-sm"
                />
              </div>

              <!-- Remove Row Button -->
              <div class="flex items-end pb-1 md:self-end">
                <button
                  type="button"
                  (click)="removeItemRow(i)"
                  [disabled]="itemsFormArray.length === 1"
                  class="btn btn-ghost btn-sm text-slate-400 hover:text-rose-600 p-2"
                  title="Remover este item"
                >
                  <app-icon name="trash" [size]="16"></app-icon>
                </button>
              </div>
            </div>
          </div>

          <!-- Total Summary -->
          <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
            <div class="text-slate-500 text-xs">
              Total de Itens: <strong class="text-slate-900">{{ itemsFormArray.length }}</strong>
            </div>
            <div class="text-slate-500 text-xs">
              Quantidade Total de Peças: <strong class="text-slate-900 font-mono">{{ calculateTotalQuantity() }} un</strong>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-3">
          <a routerLink="/notas-fiscais" class="btn btn-secondary">
            Cancelar
          </a>
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="invoiceForm.invalid || isSubmitting"
          >
            <app-icon *ngIf="isSubmitting" name="loader" [size]="16" class="animate-spin"></app-icon>
            <span>Salvar Nota Fiscal (Aberta)</span>
          </button>
        </div>
      </form>

    </div>
  `,
})
export class InvoiceCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private invoiceService = inject(InvoiceService);
  private toast = inject(ToastService);
  private router = inject(Router);

  public products$!: Observable<Product[]>;
  public invoiceForm!: FormGroup;
  public isSubmitting = false;

  get itemsFormArray(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  ngOnInit(): void {
    this.products$ = this.productService.products$;
    this.productService.loadInitialData();

    this.invoiceForm = this.fb.group({
      items: this.fb.array([this.createItemRow()]),
    });
  }

  public createItemRow(): FormGroup {
    return this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  public addItemRow(): void {
    this.itemsFormArray.push(this.createItemRow());
  }

  public removeItemRow(index: number): void {
    if (this.itemsFormArray.length > 1) {
      this.itemsFormArray.removeAt(index);
    }
  }

  public onProductChange(index: number): void {
    const row = this.itemsFormArray.at(index);
    if (!row.get('quantity')?.value) {
      row.patchValue({ quantity: 1 });
    }
  }

  public calculateTotalQuantity(): number {
    return this.itemsFormArray.controls.reduce((sum, control) => {
      const val = Number(control.get('quantity')?.value) || 0;
      return sum + val;
    }, 0);
  }

  public saveInvoice(): void {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      this.toast.error('Preencha todos os campos obrigatórios da nota fiscal.');
      return;
    }

    const items = this.itemsFormArray.value;
    if (!items || items.length === 0) {
      this.toast.error('A nota deve conter pelo menos um produto.');
      return;
    }

    this.isSubmitting = true;

    const dto: CreateInvoiceDto = {
      items: items.map((i: any) => ({
        productId: i.productId.toString(),
        quantity: Number(i.quantity),
      })),
    };

    this.invoiceService.createInvoice(dto).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.toast.success(`Nota fiscal ${created.number} criada com sucesso com status Aberta!`);
        this.router.navigate(['/notas-fiscais']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toast.error(err.message || 'Erro ao cadastrar nota fiscal.');
      },
    });
  }
}
