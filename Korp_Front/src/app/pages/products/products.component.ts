import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Subject, Observable, combineLatest } from 'rxjs';
import { map, takeUntil, startWith } from 'rxjs/operators';
import { ProductService } from '../../core/services/product.service';
import { ToastService } from '../../core/services/toast.service';
import { Product, CreateProductDto } from '../../core/models/product.model';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
              Cadastro de Produtos
            </h1>
            <span class="badge badge-info text-xs">
              {{ (filteredProducts$ | async)?.length || 0 }} cadastrados
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            Cadastre os itens com código, descrição e saldo para utilização na emissão de Notas Fiscais.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button type="button" class="btn btn-primary" (click)="openCreateModal()">
            <app-icon name="plus" [size]="18"></app-icon>
            <span>Novo Produto</span>
          </button>
        </div>
      </div>

      <!-- Filters & Search Bar -->
      <div class="card-surface p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- Search Input -->
        <div class="input-search-wrapper w-full md:w-96">
          <div class="search-icon">
            <app-icon name="search" [size]="16"></app-icon>
          </div>
          <input
            type="text"
            [formControl]="searchControl"
            placeholder="Buscar por código ou descrição..."
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

        <!-- Quick Summary Stats -->
        <div class="flex items-center gap-4 text-xs text-slate-600 w-full md:w-auto justify-end">
          <div class="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Saldo Total em Estoque:</span>
            <strong class="text-slate-900 font-mono font-bold">{{ totalStock$ | async }} un</strong>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="card-surface overflow-hidden">
        <div class="custom-table-wrapper">
          <table class="custom-table">
            <thead>
              <tr>
                <th style="width: 15%">Código</th>
                <th style="width: 45%">Descrição do Produto</th>
                <th style="width: 20%" class="text-center">Saldo em Estoque</th>
                <th style="width: 10%" class="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of filteredProducts$ | async">
                <!-- Código Obrigatório -->
                <td>
                  <span class="font-mono font-bold text-brand-700 bg-brand-50/80 px-2 py-1 rounded-md text-xs border border-brand-200/50">
                    {{ product.code }}
                  </span>
                </td>

                <!-- Descrição Obrigatória -->
                <td>
                  <div class="font-bold text-slate-900 text-sm leading-snug">{{ product.description }}</div>
                  <div class="text-[11px] text-slate-400 font-mono mt-0.5" *ngIf="product.createdAt">
                    Cadastrado em {{ product.createdAt | date: 'dd/MM/yyyy HH:mm' }}
                  </div>
                </td>

                <!-- Saldo Disponível (Obrigatório) -->
                <td class="text-center">
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold"
                    [ngClass]="{
                      'bg-emerald-50 text-emerald-800 border border-emerald-200': product.stock > 5,
                      'bg-amber-50 text-amber-800 border border-amber-200': product.stock > 0 && product.stock <= 5,
                      'bg-rose-50 text-rose-800 border border-rose-200': product.stock === 0
                    }"
                  >
                    <span>{{ product.stock }} unidades</span>
                  </div>
                  <span *ngIf="product.stock === 0" class="block text-[10px] text-rose-600 font-bold mt-0.5">
                    Sem Saldo
                  </span>
                </td>

                <!-- Ações -->
                <td class="text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      (click)="openEditModal(product)"
                      class="btn btn-ghost btn-sm p-1.5 text-slate-600 hover:text-brand-700"
                      title="Editar produto"
                    >
                      <app-icon name="edit" [size]="15"></app-icon>
                    </button>
                    <button
                      type="button"
                      (click)="confirmDelete(product)"
                      class="btn btn-ghost btn-sm p-1.5 text-slate-400 hover:text-rose-600"
                      title="Excluir produto"
                    >
                      <app-icon name="trash" [size]="15"></app-icon>
                    </button>
                  </div>
                </td>
              </tr>

              <tr *ngIf="(filteredProducts$ | async)?.length === 0">
                <td colspan="4" class="text-center py-12 text-slate-400">
                  <div class="flex flex-col items-center justify-center">
                    <app-icon name="package" [size]="40" class="text-slate-300 mb-2"></app-icon>
                    <p class="font-medium text-slate-600">Nenhum produto encontrado</p>
                    <p class="text-xs text-slate-400 mt-1">Cadastre novos produtos para utilizá-los no faturamento.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create / Edit Modal -->
      <div
        *ngIf="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
      >
        <div class="card-surface w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
          
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 class="text-base font-bold text-slate-900">
                {{ isEditing ? 'Editar Produto' : 'Cadastrar Novo Produto' }}
              </h2>
              <p class="text-xs text-slate-500">Preencha os campos obrigatórios do item.</p>
            </div>
            <button
              type="button"
              (click)="closeModal()"
              class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <app-icon name="x" [size]="18"></app-icon>
            </button>
          </div>

          <!-- Modal Body -->
          <form [formGroup]="productForm" (ngSubmit)="saveProduct()" class="p-6 space-y-4">
            
            <!-- Código -->
            <div>
              <label class="form-label">
                Código do Produto <span class="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="text"
                formControlName="code"
                placeholder="Ex: PRD01, P01, NOTE01"
                class="form-control font-mono uppercase"
                [ngClass]="{ 'border-rose-300 ring-1 ring-rose-300': isFieldInvalid('code') }"
              />
              <span *ngIf="isFieldInvalid('code')" class="text-xs text-rose-500 mt-1 block">
                O código é obrigatório.
              </span>
            </div>

            <!-- Descrição -->
            <div>
              <label class="form-label">
                Descrição do Produto <span class="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="text"
                formControlName="description"
                placeholder="Ex: Notebook Dell Latitude 14 16GB SSD 512GB"
                class="form-control"
                [ngClass]="{ 'border-rose-300 ring-1 ring-rose-300': isFieldInvalid('description') }"
              />
              <span *ngIf="isFieldInvalid('description')" class="text-xs text-rose-500 mt-1 block">
                A descrição é obrigatória.
              </span>
            </div>

            <!-- Saldo Inicial -->
            <div>
              <label class="form-label">
                Saldo (Quantidade Disponível em Estoque) <span class="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="number"
                formControlName="stock"
                min="0"
                placeholder="0"
                class="form-control font-mono"
                [ngClass]="{ 'border-rose-300 ring-1 ring-rose-300': isFieldInvalid('stock') }"
              />
              <span *ngIf="isFieldInvalid('stock')" class="text-xs text-rose-500 mt-1 block">
                O saldo deve ser maior ou igual a zero.
              </span>
            </div>

            <!-- Modal Footer Buttons -->
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                (click)="closeModal()"
                class="btn btn-secondary"
                [disabled]="isSaving"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="productForm.invalid || isSaving"
              >
                <app-icon *ngIf="isSaving" name="loader" [size]="16" class="animate-spin"></app-icon>
                <span>{{ isEditing ? 'Salvar Alterações' : 'Cadastrar Produto' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `,
})
export class ProductsComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private toast = inject(ToastService);

  private destroy$ = new Subject<void>();

  public products$!: Observable<Product[]>;
  public filteredProducts$!: Observable<Product[]>;
  public totalStock$!: Observable<number>;

  public searchControl = new FormControl('');
  public productForm!: FormGroup;

  public showModal = false;
  public isEditing = false;
  public editingProductId: string | null = null;
  public isSaving = false;

  ngOnInit(): void {
    this.initForm();
    this.setupObservables();
    this.productService.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      stock: [10, [Validators.required, Validators.min(0)]],
    });
  }

  private setupObservables(): void {
    this.products$ = this.productService.products$;

    this.totalStock$ = this.products$.pipe(
      map((products) => products.reduce((acc, p) => acc + (p.stock || 0), 0))
    );

    const search$ = this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value || '')
    );

    this.filteredProducts$ = combineLatest([
      this.products$,
      search$,
    ]).pipe(
      map(([products, searchQuery]) => {
        const query = (searchQuery || '').toLowerCase().trim();
        if (!query) return products;
        return products.filter(
          (p) =>
            p.code.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
      })
    );
  }

  public isFieldInvalid(field: string): boolean {
    const ctrl = this.productForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  public openCreateModal(): void {
    this.isEditing = false;
    this.editingProductId = null;
    this.productForm.reset({
      code: '',
      description: '',
      stock: 10,
    });
    this.showModal = true;
  }

  public openEditModal(product: Product): void {
    this.isEditing = true;
    this.editingProductId = product.id;
    this.productForm.patchValue({
      code: product.code,
      description: product.description,
      stock: product.stock,
    });
    this.showModal = true;
  }

  public closeModal(): void {
    this.showModal = false;
    this.productForm.reset();
  }

  public saveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formVal = this.productForm.value;

    const dto: CreateProductDto = {
      code: formVal.code.trim(),
      description: formVal.description.trim(),
      stock: Number(formVal.stock),
    };

    if (this.isEditing && this.editingProductId) {
      this.productService.updateProduct(this.editingProductId, dto).subscribe({
        next: (updated) => {
          this.isSaving = false;
          this.toast.success(`Produto "${updated.code}" atualizado com sucesso!`);
          this.closeModal();
        },
        error: (err) => {
          this.isSaving = false;
          this.toast.error(err.message || 'Erro ao atualizar produto.');
        },
      });
    } else {
      this.productService.createProduct(dto).subscribe({
        next: (created) => {
          this.isSaving = false;
          this.toast.success(`Produto "${created.code}" cadastrado com sucesso!`);
          this.closeModal();
        },
        error: (err) => {
          this.isSaving = false;
          this.toast.error(err.message || 'Erro ao cadastrar produto.');
        },
      });
    }
  }

  public confirmDelete(product: Product): void {
    if (confirm(`Tem certeza que deseja excluir o produto ${product.code} - ${product.description}?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.toast.success(`Produto ${product.code} excluído.`);
        },
        error: (err) => {
          this.toast.error(err.message || 'Erro ao excluir produto.');
        },
      });
    }
  }
}
