export type InvoiceStatus = 'Aberta' | 'Fechada';

export interface InvoiceItem {
  id?: number;
  productId: string;
  productCode?: string;
  productDescription: string;
  quantity: number;
}

export interface Invoice {
  id: string;
  sequenceNumber: number; // Numeração sequencial
  number: string; // Ex: "NF-000001"
  status: InvoiceStatus; // 'Aberta' ou 'Fechada'
  issueDate?: string;
  items: InvoiceItem[];
  totalItems: number;
  totalQuantity: number;
}

export interface CreateInvoiceDto {
  items: {
    productId: string;
    quantity: number;
  }[];
}
