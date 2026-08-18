# Teste Técnico Korp — Emissão de Notas Fiscais e Controle de Estoque
**Candidato:** Kauã Andrade

---

## Estrutura do Repositório

```
Teste_Korp_KauaAndrade/
├── Korp_Teste_KauaAndrade.slnx      # Solução .NET Backend
├── src/                             # Código-fonte do Backend (.NET C#)
│   ├── ServicoEstoque/              # API de Gestão de Estoque (SQL Server)
│   │   └── ServicoEstoque.API/
│   └── ServicoFaturamento/          # API de Faturamento e Notas Fiscais (MySQL)
│       └── ServicoFaturamento.API/
└── Korp_Front/                      # Aplicação Frontend (Angular Standalone)
    ├── src/
    ├── README.md
    └── ROTAS_BACKEND.md
```

---

## Arquitetura e Bancos de Dados

O projeto adota uma arquitetura desacoplada de microsserviços em **.NET C#**, onde cada serviço possui seu próprio banco de dados relacional e responsabilidade bem definida:

### 1. Serviço de Estoque (`ServicoEstoque.API`)
- **Linguagem / Framework:** C# (.NET 10) / ASP.NET Core Web API
- **Banco de Dados:** **Microsoft SQL Server**
- **Base de Dados:** `GestaoEstoque`
- **ORM:** Entity Framework Core (`Microsoft.EntityFrameworkCore.SqlServer`)
- **Tabela Principal:**
  - `Produtos`: Armazena o identificador (`Id`), código único (`Codigo`), descrição (`Descricao`) e quantidade física disponível (`Saldo`).
- **Endpoints Principais:**
  - `GET /api/produtos` — Lista todos os produtos cadastrados com seus saldos.
  - `GET /api/produtos/{id}` ou `GET /api/produtos/{codigo}` — Consulta produto por ID ou código.
  - `POST /api/produtos` — Cadastro de novo produto.
  - `PUT /api/produtos/{id}` — Edição de dados do produto.
  - `DELETE /api/produtos/{id}` — Exclusão de produto.
  - `POST /api/produtos/{id}/debitar-estoque` — Baixa atômica de saldo no estoque.

### 2. Serviço de Faturamento (`ServicoFaturamento.API`)
- **Linguagem / Framework:** C# (.NET 10) / ASP.NET Core Web API
- **Banco de Dados:** **MySQL**
- **Base de Dados:** `GestaoFaturamento`
- **ORM:** Entity Framework Core com provedor Pomelo (`Pomelo.EntityFrameworkCore.MySql`)
- **Tabelas Principais:**
  - `NotasFiscais`: Armazena o número da nota (`Numero`) e o status atual (`Status`: 0 = Aberta, 1 = Fechada).
  - `NotaFiscalProdutos`: Relacionamento 1:N contendo os itens da nota (`ProdutoId` e `Quantidade`).
- **Comunicação entre Serviços:**
  - O `ServicoFaturamento` utiliza `IHttpClientFactory` para se comunicar com o `ServicoEstoque`, consultando a disponibilidade de saldo antes de emitir e efetuando a baixa de estoque no momento da impressão/fechamento da nota.
- **Endpoints Principais:**
  - `GET /api/notas-fiscais` — Lista todas as notas fiscais emitidas.
  - `GET /api/notas-fiscais/{id}` — Detalhes de uma nota fiscal e seus itens.
  - `POST /api/notas-fiscais` — Cadastro de nota fiscal com status inicial "Aberta".
  - `POST /api/notas-fiscais/{id}/imprimir` — Fecha a nota fiscal (status "Fechada") e efetua a baixa de saldo no Serviço de Estoque.
  - `DELETE /api/notas-fiscais/{id}` — Exclusão de nota fiscal.

### 3. Frontend (`Korp_Front`)
- **Tecnologias:** Angular Standalone, TypeScript, RxJS, formulários reativos (`ReactiveFormsModule`) e design system customizado com suporte a impressão DANFE (`@media print`).

---

## Configuração dos Bancos de Dados

As strings de conexão estão configuradas nos arquivos `appsettings.json` de cada microsserviço:

### SQL Server (`src/ServicoEstoque/ServicoEstoque.API/appsettings.json`):
```json
{
  "ConnectionStrings": {
    "EstoqueDbConnectionString": "Server=localhost\\SQLEXPRESS;Database=GestaoEstoque;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

### MySQL (`src/ServicoFaturamento/ServicoFaturamento.API/appsettings.json`):
```json
{
  "ConnectionStrings": {
    "FaturamentoDbConnectionString": "Server=localhost;Port=3306;Database=GestaoFaturamento;User=root;Password=admin123;"
  },
  "ServicosExternos": {
    "EstoqueApiUrl": "http://localhost:5025"
  }
}
```

Para aplicar as migrações e criar os esquemas nos bancos de dados:
```bash
# Migrações do Estoque (SQL Server)
dotnet ef database update --project src/ServicoEstoque/ServicoEstoque.API/ServicoEstoque.API.csproj

# Migrações do Faturamento (MySQL)
dotnet ef database update --project src/ServicoFaturamento/ServicoFaturamento.API/ServicoFaturamento.API.csproj
```

---

## Como Executar

### 1. Backend (.NET)
Para restaurar e compilar a solução completa:
```bash
dotnet restore Korp_Teste_KauaAndrade.slnx
dotnet build Korp_Teste_KauaAndrade.slnx
```

Para rodar os serviços individualmente:
- **Serviço de Estoque:**
  ```bash
  dotnet run --project src/ServicoEstoque/ServicoEstoque.API/ServicoEstoque.API.csproj
  ```
- **Serviço de Faturamento:**
  ```bash
  dotnet run --project src/ServicoFaturamento/ServicoFaturamento.API/ServicoFaturamento.API.csproj
  ```

---

### 2. Frontend (Angular)
Entre na pasta `Korp_Front`:
```bash
cd Korp_Front
npm install
npm start
```
Acesse [http://localhost:4200](http://localhost:4200).
