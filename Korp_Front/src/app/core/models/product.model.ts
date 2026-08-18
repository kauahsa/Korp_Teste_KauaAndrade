export interface Product {
  id: string;
  code: string; // Código obrigatório
  description: string; // Descrição (nome do produto)
  stock: number; // Saldo (quantidade disponível em estoque)
  createdAt?: string;
}

export interface CreateProductDto {
  code: string;
  description: string;
  stock: number;
}
