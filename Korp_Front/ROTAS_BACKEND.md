# Especificação das Rotas da API Backend (REST)

Para integrar este frontend Angular ao backend em **C# (.NET)**, estão disponibilizados os seguintes endpoints RESTful:

---

## 1. Módulo de Produtos (`/api/produtos`) — Serviço de Estoque (.NET / SQL Server)

### `GET /api/produtos`
- **Finalidade:** Retorna a lista de todos os produtos cadastrados com seus respectivos saldos em estoque.
- **Resposta Sucesso (`200 OK`):**
```json
[
  {
    "id": 1,
    "codigo": "PRD-001",
    "descricao": "Notebook Dell Latitude 14 16GB SSD 512GB",
    "saldo": 10
  }
]
```

### `GET /api/produtos/{id}`
- **Finalidade:** Retorna os dados de um produto específico por ID.
- **Resposta Sucesso (`200 OK`):** Objeto do produto.
- **Resposta Erro (`404 Not Found`):** Produto não encontrado.

### `GET /api/produtos/{codigo}`
- **Finalidade:** Retorna os dados de um produto específico por Código.
- **Resposta Sucesso (`200 OK`):** Objeto do produto.
- **Resposta Erro (`404 Not Found`):** Produto não encontrado.

### `POST /api/produtos`
- **Finalidade:** Cadastrar um novo produto com saldo inicial.
- **Campos Obrigatórios:** `codigo`, `descricao`, `saldo`.
- **Corpo da Requisição (`Request Body`):**
```json
{
  "codigo": "PRD-007",
  "descricao": "Teclado Sem Fio Logitech",
  "saldo": 20
}
```
- **Validações do Backend:**
  - Código único (retornar erro se já existir outro produto com o mesmo código).
  - Saldo não negativo (`saldo >= 0`).

### `PUT /api/produtos/{id}`
- **Finalidade:** Atualizar dados ou saldo do produto.
- **Resposta Sucesso (`200 OK`):** Objeto atualizado.

### `DELETE /api/produtos/{id}`
- **Finalidade:** Excluir um produto.
- **Resposta Sucesso (`204 No Content`).**

### `POST /api/produtos/{id}/debitar-estoque`
- **Finalidade:** Realizar a dedução de saldo de um produto.
- **Corpo da Requisição (`Request Body`):**
```json
{
  "quantidade": 2
}
```

---

## 2. Módulo de Notas Fiscais (`/api/notas-fiscais`) — Serviço de Faturamento (.NET / MySQL)

### `GET /api/notas-fiscais`
- **Finalidade:** Listar todas as notas fiscais emitidas (com status `Aberta` ou `Fechada`).
- **Resposta Sucesso (`200 OK`):** Lista de notas fiscais com seus itens vinculados.

### `GET /api/notas-fiscais/{id}`
- **Finalidade:** Obter os detalhes completos de uma nota fiscal.

### `POST /api/notas-fiscais`
- **Finalidade:** Criar uma nova nota fiscal sequencial com status inicial **"Aberta"**.
- **Corpo da Requisição (`Request Body`):**
```json
{
  "numero": 1001,
  "status": 0,
  "produtos": [
    {
      "produtoId": 1,
      "quantidade": 2
    }
  ]
}
```
- **Regras do Backend:**
  - Definir o `status` inicial como **"Aberta"** (enum 0).
  - Validar se a quantidade de cada produto é maior que 0.

---

## 3. Rota de Impressão & Fechamento da Nota

### `POST /api/notas-fiscais/{id}/imprimir`
*(Compatível também com `PATCH /api/notas-fiscais/{id}/status` e `PUT /api/notas-fiscais/{id}/fechar`)*

- **Finalidade:** Executar o fluxo fiscal de impressão, fechamento da nota e baixa atômica de estoque via comunicação HTTP com o Serviço de Estoque.
- **Regras de Negócio Obrigatórias:**
  1. **Validação de Status:** Verificar se a nota está com status **"Aberta"**. Se já estiver "Fechada", retornar erro informando que apenas notas abertas podem ser impressas.
  2. **Validação de Estoque:** Consultar a API de Estoque para verificar se todos os produtos possuem saldo disponível suficiente.
  3. **Baixa no Estoque:** Chamar o endpoint de débito de estoque do Serviço de Estoque (`POST /api/produtos/{id}/debitar-estoque`).
  4. **Atualização da Nota:** Atualizar o status da nota para **"Fechada"** no banco de dados MySQL.
- **Resposta Sucesso (`200 OK`):** Objeto da nota fiscal atualizada com status "Fechada".
