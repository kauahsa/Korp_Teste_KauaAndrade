# Korp Fiscal — Sistema de Emissão de Notas Fiscais

Aplicação desenvolvida em **Angular Standalone** para atender aos requisitos de **Emissão de Notas Fiscais e Controle de Estoque**.

---

## Funcionalidades Implementadas

1. **Cadastro de Produtos:**
   - Campos obrigatórios: Código, Descrição e Saldo (quantidade disponível em estoque).
   - Validações de código único, saldo não negativo, listagem com busca e filtros em tempo real.
   - Atualização de saldo em tempo real.

2. **Cadastro de Notas Fiscais:**
   - Numeração sequencial gerada automaticamente.
   - Status inicial obrigatório: **Aberta**.
   - Inclusão de múltiplos produtos com quantidades e verificação instantânea de saldo em estoque.
   - Cálculo automático de subtotais e valor total da nota.

3. **Impressão de Notas Fiscais:**
   - Botão de impressão visível e intuitivo na listagem.
   - Ao clicar: exibe indicador de processamento com barra de progresso visual.
   - Ao concluir: atualiza o status da nota para **Fechada**.
   - **Bloqueio de segurança:** Não permite a impressão de notas com status diferente de "Aberta".
   - **Atualização de saldo:** Debita do estoque as quantidades utilizadas em cada item da nota (Ex: saldo anterior = 10; nota utiliza 2 -> novo saldo = 8).
   - Visualizador de **DANFE formatado** pronto para impressão direta (`window.print()`).

---

## Tecnologias Utilizadas

- **Frontend:** Angular Standalone
- **Linguagem:** TypeScript
- **Reatividade & Estado:** RxJS (`BehaviorSubject`, `combineLatest`, `map`, `tap`, etc.)
- **Formulários:** `@angular/forms` (`ReactiveFormsModule`, `FormBuilder`, `Validators`)
- **Estilização:** CSS Design System customizado (Tokens HSL, Glassmorphism, Layout DANFE `@media print`)
- **Ícones & Micro-interações:** Engine SVG Standalone (`AppIcon`) e `canvas-confetti`

---

## Integração com Banco de Dados e Backend

O backend da solução foi construído em **.NET C#** utilizando arquitetura de microsserviços e persistência em bancos de dados relacionais distintos:

- **Serviço de Estoque (`ServicoEstoque.API`):**
  - Banco de Dados: **Microsoft SQL Server** (Base: `GestaoEstoque`).
  - ORM: Entity Framework Core (`Microsoft.EntityFrameworkCore.SqlServer`).
  - Responsável pelo gerenciamento do catálogo e saldo físico dos produtos.

- **Serviço de Faturamento (`ServicoFaturamento.API`):**
  - Banco de Dados: **MySQL** (Base: `GestaoFaturamento`).
  - ORM: Entity Framework Core com provedor Pomelo (`Pomelo.EntityFrameworkCore.MySql`).
  - Responsável pelas notas fiscais, itens da nota e pela orquestração da baixa no estoque via comunicação HTTP (`IHttpClientFactory`).

---

## Como Executar o Projeto Localmente

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm start
   # ou
   npx ng serve
   ```

3. **Acessar no navegador:**
   Abra [http://localhost:4200](http://localhost:4200) no seu navegador.

---

## Estrutura do Projeto

```
src/
├── app/
│   ├── core/
│   │   ├── models/           # Interfaces TypeScript (Product, Invoice, Toast)
│   │   └── services/         # Serviços de Domínio Reativos (ProductService, InvoiceService, ToastService)
│   ├── shared/
│   │   └── components/       # Componentes Compartilhados (Header, Sidebar, AppIcon, DanfePreview, PrintModal, Toast)
│   ├── pages/
│   │   ├── dashboard/        # Painel com KPIs, métricas e ações rápidas
│   │   ├── products/         # Tela de Cadastro e Gestão de Produtos
│   │   └── invoices/         # Listagem e Emissão de Notas Fiscais
│   ├── app.routes.ts         # Rotas da aplicação SPA
│   ├── app.ts / app.html     # Layout principal
│   └── app.config.ts         # Provedores da aplicação
├── styles.css                # Design System Global e Estilos @media print
└── index.html                # HTML Base
```
