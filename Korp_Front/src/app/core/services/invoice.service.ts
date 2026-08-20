import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Invoice, InvoiceItem, CreateInvoiceDto } from '../models/invoice.model';
import { ProductService } from './product.service';
import { environment } from '../../../environments/environment';

export interface BackendNotaFiscalProduto {
  id?: number;
  notaFiscalId?: number;
  produtoId: number;
  descricaoProduto: string;
  quantidade: number;
}

export interface BackendNotaFiscal {
  id: number;
  numeroNota: number;
  status: number; // 0 = Aberta, 1 = Fechada
  dataRegistro?: string;
  produtos: BackendNotaFiscalProduto[];
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private http = inject(HttpClient);
  private productService = inject(ProductService);

  private invoicesSubject = new BehaviorSubject<Invoice[]>([]);
  public invoices$: Observable<Invoice[]> = this.invoicesSubject.asObservable();

  constructor() {
    this.loadInitialInvoices();
  }

  public loadInitialInvoices(): void {
    if (environment.useBackendApi) {
      this.fetchFromBackend().subscribe({
        next: (invoices) => {
          this.invoicesSubject.next(invoices);
        },
        error: (err) => {
          console.error('Erro ao buscar notas fiscais da API:', err);
        },
      });
    }
  }

  public fetchFromBackend(): Observable<Invoice[]> {
    return this.http.get<BackendNotaFiscal[]>(`${environment.faturamentoApiUrl}/notas-fiscais`).pipe(
      map((backendInvoices) =>
        backendInvoices.map((nf) => this.mapBackendToInvoice(nf))
      ),
      tap((invoices) => {
        this.invoicesSubject.next(invoices);
      })
    );
  }

  public mapBackendToInvoice(nf: BackendNotaFiscal): Invoice {
    const seq = nf.numeroNota || nf.id;
    const items: InvoiceItem[] = (nf.produtos || []).map((p) => {
      const prod = this.productService.getProductById(p.produtoId.toString());
      return {
        id: p.id,
        productId: p.produtoId.toString(),
        productCode: prod ? prod.code : `ID: ${p.produtoId}`,
        productDescription: p.descricaoProduto || (prod ? prod.description : 'Produto'),
        quantity: p.quantidade,
      };
    });

    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      id: nf.id.toString(),
      sequenceNumber: seq,
      number: `NF-${seq.toString().padStart(6, '0')}`,
      status: nf.status === 1 ? 'Fechada' : 'Aberta',
      issueDate: nf.dataRegistro,
      items: items,
      totalItems: items.length,
      totalQuantity: totalQty,
    };
  }

  public getInvoices(): Observable<Invoice[]> {
    if (environment.useBackendApi) {
      this.fetchFromBackend().subscribe({
        next: (items) => this.invoicesSubject.next(items),
        error: () => {},
      });
    }
    return this.invoices$;
  }

  public getInvoiceById(id: string): Invoice | undefined {
    return this.invoicesSubject.getValue().find((inv) => inv.id.toString() === id.toString());
  }

  public createInvoice(dto: CreateInvoiceDto): Observable<Invoice> {
    if (!dto.items || dto.items.length === 0) {
      return throwError(() => new Error('A Nota Fiscal deve conter pelo menos 1 produto incluído.'));
    }

    for (const itemDto of dto.items) {
      if (itemDto.quantity <= 0) {
        return throwError(() => new Error('A quantidade de cada produto deve ser maior que zero.'));
      }
    }

    const backendPayload = {
      status: 0, // 0 = Aberta
      produtos: dto.items.map((i) => {
        const prod = this.productService.getProductById(i.productId);
        return {
          produtoId: parseInt(i.productId, 10) || 1,
          descricaoProduto: prod ? prod.description : 'Produto',
          quantidade: i.quantity,
        };
      }),
    };

    return this.http.post<BackendNotaFiscal>(`${environment.faturamentoApiUrl}/notas-fiscais`, backendPayload).pipe(
      map((res) => {
        const newInvoice = this.mapBackendToInvoice(res);
        const currentList = this.invoicesSubject.getValue();
        this.invoicesSubject.next([newInvoice, ...currentList]);
        return newInvoice;
      }),
      catchError((err) => {
        let msg = 'Erro ao cadastrar nota fiscal na API de Faturamento.';
        if (err?.error?.errors) {
          const validationList = Object.values(err.error.errors).flat();
          msg = validationList.join(' | ');
        } else if (typeof err?.error === 'string') {
          msg = err.error;
        } else if (err?.error?.message) {
          msg = err.error.message;
        } else if (err?.message) {
          msg = err.message;
        }
        return throwError(() => new Error(msg));
      })
    );
  }

  public processAndPrintInvoice(invoiceId: string): Observable<Invoice> {
    const currentInvoice = this.getInvoiceById(invoiceId);
    if (currentInvoice && currentInvoice.status !== 'Aberta') {
      return throwError(() => new Error('Apenas notas fiscais com status "Aberta" podem ser impressas. Esta nota possui status diferente de Aberta.'));
    }

    const numericId = parseInt(invoiceId, 10) || 0;

    return this.http.post<BackendNotaFiscal>(`${environment.faturamentoApiUrl}/notas-fiscais/${numericId}/imprimir`, {}).pipe(
      map((res) => {
        const updatedInvoice = this.mapBackendToInvoice(res);

        const currentList = this.invoicesSubject.getValue();
        const index = currentList.findIndex((i) => i.id.toString() === invoiceId.toString());
        if (index !== -1) {
          currentList[index] = updatedInvoice;
          this.invoicesSubject.next([...currentList]);
        }

        // Recarrega os saldos atualizados de estoque
        this.productService.loadInitialData();

        return updatedInvoice;
      }),
      catchError((err) => {
        const msg = err?.error?.message || (typeof err?.error === 'string' ? err.error : null) || err?.message || 'Erro ao processar e imprimir nota fiscal.';
        return throwError(() => new Error(typeof msg === 'string' ? msg : JSON.stringify(msg)));
      })
    );
  }

  public deleteInvoice(id: string): Observable<boolean> {
    const numericId = parseInt(id, 10) || 0;

    return this.http.delete(`${environment.faturamentoApiUrl}/notas-fiscais/${numericId}`).pipe(
      map(() => {
        const currentList = this.invoicesSubject.getValue();
        const updated = currentList.filter((inv) => inv.id.toString() !== id.toString());
        this.invoicesSubject.next(updated);
        return true;
      }),
      catchError((err) => {
        const msg = err?.error?.message || (typeof err?.error === 'string' ? err.error : null) || 'Erro ao excluir nota fiscal.';
        return throwError(() => new Error(msg));
      })
    );
  }
}
