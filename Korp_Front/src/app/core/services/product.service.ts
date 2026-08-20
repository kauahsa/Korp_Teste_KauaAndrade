import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Product, CreateProductDto } from '../models/product.model';
import { environment } from '../../../environments/environment';

export interface BackendProduto {
  id: number;
  codigo: string;
  descricao?: string;
  quantidadeEstoque: number;
  dataRegistro?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$: Observable<Product[]> = this.productsSubject.asObservable();

  constructor() {
    this.loadInitialData();
  }

  public loadInitialData(): void {
    if (environment.useBackendApi) {
      this.fetchFromBackend().subscribe({
        next: (products) => {
          this.productsSubject.next(products);
        },
        error: (err) => {
          console.error('Erro ao buscar produtos da API:', err);
        },
      });
    }
  }

  public fetchFromBackend(): Observable<Product[]> {
    return this.http.get<BackendProduto[]>(`${environment.estoqueApiUrl}/produtos`).pipe(
      map((backendItems) =>
        backendItems.map((p) => ({
          id: p.id.toString(),
          code: p.codigo,
          description: p.descricao || '',
          stock: p.quantidadeEstoque,
          createdAt: p.dataRegistro,
        }))
      ),
      tap((products) => {
        this.productsSubject.next(products);
      })
    );
  }

  public getProducts(): Observable<Product[]> {
    if (environment.useBackendApi) {
      this.fetchFromBackend().subscribe({
        next: (items) => this.productsSubject.next(items),
        error: () => {},
      });
    }
    return this.products$;
  }

  public getProductById(id: string): Product | undefined {
    return this.productsSubject.getValue().find((p) => p.id.toString() === id.toString());
  }

  public createProduct(dto: CreateProductDto): Observable<Product> {
    const cleanCode = dto.code.trim();

    if (!cleanCode) {
      return throwError(() => new Error('O código do produto é obrigatório.'));
    }

    const existingWithCode = this.productsSubject.getValue().find(
      (p) => p.code.toLowerCase().trim() === cleanCode.toLowerCase()
    );
    if (existingWithCode) {
      return throwError(() => new Error(`Já existe um produto cadastrado com o código "${cleanCode}".`));
    }

    if (!dto.description || dto.description.trim() === '') {
      return throwError(() => new Error('A descrição do produto é obrigatória.'));
    }

    if (dto.stock < 0) {
      return throwError(() => new Error('O saldo inicial não pode ser negativo.'));
    }

    const backendPayload = {
      codigo: cleanCode,
      descricao: dto.description.trim(),
      quantidadeEstoque: Number(dto.stock),
    };

    return this.http.post<BackendProduto>(`${environment.estoqueApiUrl}/produtos`, backendPayload).pipe(
      map((res) => {
        const newProduct: Product = {
          id: res.id.toString(),
          code: res.codigo,
          description: res.descricao || dto.description.trim(),
          stock: res.quantidadeEstoque,
          createdAt: res.dataRegistro,
        };

        const currentList = this.productsSubject.getValue();
        this.productsSubject.next([newProduct, ...currentList]);
        return newProduct;
      }),
      catchError((err) => {
        let errorMsg = 'Erro ao cadastrar produto na API de Estoque.';
        if (err?.error?.message) {
          errorMsg = err.error.message;
        } else if (typeof err?.error === 'string') {
          errorMsg = err.error;
        } else if (err?.message) {
          errorMsg = err.message;
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  public updateProduct(id: string, dto: CreateProductDto): Observable<Product> {
    const cleanCode = dto.code.trim();

    if (!cleanCode) {
      return throwError(() => new Error('O código do produto é obrigatório.'));
    }

    const existingWithCode = this.productsSubject.getValue().find(
      (p) => p.id.toString() !== id.toString() && p.code.toLowerCase().trim() === cleanCode.toLowerCase()
    );
    if (existingWithCode) {
      return throwError(() => new Error(`Já existe outro produto cadastrado com o código "${cleanCode}".`));
    }

    if (!dto.description || dto.description.trim() === '') {
      return throwError(() => new Error('A descrição do produto é obrigatória.'));
    }

    if (dto.stock < 0) {
      return throwError(() => new Error('O saldo não pode ser negativo.'));
    }

    const numericId = parseInt(id, 10) || 0;
    const backendPayload = {
      id: numericId,
      codigo: cleanCode,
      descricao: dto.description.trim(),
      quantidadeEstoque: Number(dto.stock),
    };

    return this.http.put<BackendProduto>(`${environment.estoqueApiUrl}/produtos/${numericId}`, backendPayload).pipe(
      map((res) => {
        const updated: Product = {
          id: res.id.toString(),
          code: res.codigo,
          description: res.descricao || dto.description.trim(),
          stock: res.quantidadeEstoque,
          createdAt: res.dataRegistro,
        };

        const currentList = this.productsSubject.getValue();
        const idx = currentList.findIndex((p) => p.id.toString() === id.toString());
        if (idx !== -1) {
          currentList[idx] = updated;
          this.productsSubject.next([...currentList]);
        }
        return updated;
      }),
      catchError((err) => {
        let msg = 'Erro ao atualizar produto na API de Estoque.';
        if (err?.error?.message) {
          msg = err.error.message;
        } else if (typeof err?.error === 'string') {
          msg = err.error;
        } else if (err?.message) {
          msg = err.message;
        }
        return throwError(() => new Error(msg));
      })
    );
  }

  public deleteProduct(id: string): Observable<boolean> {
    const numericId = parseInt(id, 10) || 0;

    return this.http.delete(`${environment.estoqueApiUrl}/produtos/${numericId}`).pipe(
      map(() => {
        const currentList = this.productsSubject.getValue();
        const updated = currentList.filter((p) => p.id.toString() !== id.toString());
        this.productsSubject.next(updated);
        return true;
      }),
      catchError((err) => {
        const msg = err?.error?.message || (typeof err?.error === 'string' ? err.error : null) || 'Erro ao excluir produto.';
        return throwError(() => new Error(msg));
      })
    );
  }
}
