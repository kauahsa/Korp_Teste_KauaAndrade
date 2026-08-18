# 🌐 Especificação das Rotas da API Backend (REST)

Para integrar este frontend Angular a um backend em **C# (.NET)** ou **Golang**, você precisará disponibilizar os seguintes endpoints RESTful no endereço base (por exemplo: `http://localhost:5000/api`):

---

## 1. Módulo de Produtos (`/api/produtos`)

### `GET /api/produtos`
- **Finalidade:** Retorna a lista de todos os produtos cadastrados com seus respectivos saldos em estoque.
- **Resposta Sucesso (`200 OK`):**
```json
[
  {
    "id": "prod_1",
    "code": "PRD-001",
    "description": "Notebook Dell Latitude 14 16GB SSD 512GB",
    "stock": 10,
    "unitPrice": 4850.0,
    "unit": "UN",
    "category": "Informática & Hardware",
    "createdAt": "2026-08-16T10:00:00Z"
  }
]
```

### `GET /api/produtos/{id}`
- **Finalidade:** Retorna os dados de um produto específico.
- **Resposta Sucesso (`200 OK`):** Objeto do produto.
- **Resposta Erro (`404 Not Found`):** Produto não encontrado.

### `POST /api/produtos`
- **Finalidade:** Cadastrar um novo produto com saldo inicial.
- **Campos Obrigatórios:** `code`, `description`, `stock`.
- **Corpo da Requisição (`Request Body`):**
```json
{
  "code": "PRD-007",
  "description": "Teclado Sem Fio Logitech",
  "stock": 20,
  "unitPrice": 250.0,
  "unit": "UN",
  "category": "Periféricos"
}
```
- **Validações do Backend:**
  - Código único (retornar `400 Bad Request` se já existir outro produto com o mesmo código).
  - Saldo não negativo (`stock >= 0`).

### `PUT /api/produtos/{id}`
- **Finalidade:** Atualizar dados ou saldo do produto.
- **Resposta Sucesso (`200 OK`):** Objeto atualizado.

### `DELETE /api/produtos/{id}`
- **Finalidade:** Excluir um produto.
- **Resposta Sucesso (`204 No Content` ou `200 OK`).**

---

## 2. Módulo de Notas Fiscais (`/api/notas-fiscais`)

### `GET /api/notas-fiscais`
- **Finalidade:** Listar todas as notas fiscais emitidas (com status `Aberta` ou `Fechada`).
- **Resposta Sucesso (`200 OK`):**
```json
[
  {
    "id": "inv_1001",
    "sequenceNumber": 1001,
    "number": "NF-001001",
    "status": "Aberta",
    "issueDate": "2026-08-16T14:00:00Z",
    "customerName": "TechCorp Soluções Ltda",
    "customerDocument": "34.123.456/0001-89",
    "customerCity": "São Paulo / SP",
    "operationNature": "Venda de Mercadorias",
    "totalItems": 2,
    "totalQuantity": 4,
    "totalAmount": 10940.0,
    "items": [
      {
        "productId": "prod_1",
        "productCode": "PRD-001",
        "productDescription": "Notebook Dell Latitude 14",
        "quantity": 2,
        "unitPrice": 4850.0,
        "unit": "UN",
        "totalPrice": 9700.0
      }
    ]
  }
]
```

### `GET /api/notas-fiscais/{id}`
- **Finalidade:** Obter os detalhes completos de uma nota fiscal.

### `POST /api/notas-fiscais`
- **Finalidade:** Criar uma nova nota fiscal sequencial com status inicial **"Aberta"**.
- **Corpo da Requisição (`Request Body`):**
```json
{
  "customerName": "Empresa Cliente S/A",
  "customerDocument": "12.345.678/0001-90",
  "customerCity": "Curitiba / PR",
  "operationNature": "Venda de Mercadorias",
  "items": [
    {
      "productId": "prod_1",
      "quantity": 2
    },
    {
      "productId": "prod_3",
      "quantity": 1
    }
  ],
  "notes": "Entrega via transportadora."
}
```
- **Regras do Backend:**
  - Gerar a **numeração sequencial** automática (`sequenceNumber` incremental).
  - Definir o `status` obrigatoriamente como **"Aberta"**.
  - Validar se a quantidade de cada produto é $\ge 1$ e se há saldo disponível.

---

##3. Rota de Impressão & Fechamento da Nota (CRUCIAL)

### `POST /api/notas-fiscais/{id}/imprimir`
*(Ou `PUT /api/notas-fiscais/{id}/fechar`)*

- **Finalidade:** Executar o fluxo fiscal de impressão, fechamento da nota e baixa atômica de estoque.
- **Regras de Negócio Obrigatórias:**
  1. **Validação de Status:** Verificar se a nota está com status **"Aberta"**. Se já estiver "Fechada", retornar `400 Bad Request` com mensagem: *"Apenas notas fiscais com status Aberta podem ser impressas."*
  2. **Validação de Estoque:** Verificar se todos os produtos contidos na nota possuem saldo disponível suficiente no estoque.
  3. **Baixa Atômica no Estoque:** Debitar a quantidade de cada produto dentro de uma transação de banco de dados (`Saldo_Novo = Saldo_Anterior - Quantidade_Nota`).
     - *Exemplo do teste:* Saldo anterior = 10; nota utiliza 2 unidades $\rightarrow$ Novo saldo = 8.
  4. **Atualização da Nota:** Mudar o status da nota para **"Fechada"** e registrar a data de fechamento (`closedDate`).
- **Resposta Sucesso (`200 OK`):**
```json
{
  "id": "inv_1001",
  "number": "NF-001001",
  "status": "Fechada",
  "closedDate": "2026-08-16T14:50:00Z",
  "customerName": "TechCorp Soluções Ltda",
  "totalAmount": 10940.0,
  "items": [ ... ]
}
```
- **Resposta de Erro de Saldo (`422 Unprocessable Entity` ou `400 Bad Request`):**
```json
{
  "statusCode": 400,
  "message": "Saldo insuficiente para o produto 'Notebook Dell'. Saldo disponível: 1, Solicitado na nota: 2."
}
```

---


