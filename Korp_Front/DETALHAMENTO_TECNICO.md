# 📘 Detalhamento Técnico da Solução — Korp Fiscal
## Sistema de Emissão de Notas Fiscais & Gestão de Estoque em Angular

Este documento reúne todas as informações técnicas e respostas aos questionamentos do projeto técnico, servindo como **guia de apoio e roteiro oficial para a gravação do vídeo de demonstração**.

---

## 🎯 1. Resumo do Escopo e Funcionalidades Desenvolvidas

### 1.1 Cadastro de Produtos
- **Campos Obrigatórios:**
  - **Código:** Identificador único (ex: `PRD-001`).
  - **Descrição:** Nome/detalhamento do produto.
  - **Saldo:** Quantidade disponível em estoque (validação de valores $\ge 0$).
- **Funcionalidades:**
  - Listagem com busca reativa em tempo real por código, descrição ou categoria.
  - Cadastro e edição via formulários reativos (`ReactiveFormsModule`).
  - Badges visuais dinâmicos de status de estoque (*Em Estoque*, *Estoque Baixo*, *Esgotado*).
  - Exclusão com confirmação e histórico de movimentações auditável.

### 1.2 Cadastro de Notas Fiscais
- **Campos Obrigatórios:**
  - **Numeração Sequencial:** Gerada e calculada automaticamente (ex: `NF-001001`, `NF-001002`...).
  - **Status Inicial:** Obrigatoriamente fixado em **"Aberta"**.
  - **Inclusão de Múltiplos Produtos com Respectivas Quantidades:**
    - Seletor inteligente de produtos cadastrados exibindo saldo atual disponível.
    - Validação em tempo real: bloqueia inclusão caso a quantidade ultrapasse o estoque ou seja menor/igual a zero.
    - Tabela dinâmica de itens com recálculo automático de subtotais e valor total da nota.

### 1.3 Impressão de Notas Fiscais
- **Botão de Impressão:** Visível, intuitivo e com destaque visual nas linhas de notas abertas e no cabeçalho.
- **Fluxo de Processamento:**
  1. **Indicador de Processamento:** Ao clicar no botão, exibe modal com barra de progresso e simulação de validação fiscal e reserva de saldo.
  2. **Atualização do Status:** Após o processamento, o status da nota é alterado para **"Fechada"**.
  3. **Validação de Bloqueio:** **Não é permitida** a impressão de notas com status diferente de "Aberta" (o botão de impressão é desabilitado/bloqueado para notas "Fechadas", exibindo a opção de visualização de DANFE).
  4. **Atualização do Saldo dos Produtos:** O saldo de cada produto utilizado na nota é debitado no estoque de forma atômica.
     - *Exemplo do enunciado:* Saldo anterior = 10; nota utiliza 2 unidades $\rightarrow$ Novo saldo = 8.
  5. **Visualização do DANFE:** Modal formatado com layout oficial de Nota Fiscal Eletrônica e suporte nativo a impressão (`window.print()` / `@media print`).

---

## ⚙️ 2. Questionário Técnico Obrigatório

### 2.1 Quais ciclos de vida do Angular foram utilizados?
1. **`ngOnInit`:**
   - Utilizado em componentes como `DashboardComponent`, `ProductsComponent`, `InvoicesListComponent` e `PrintModalComponent`.
   - Responsável por iniciar as subscrições reativas nos Observables dos serviços (`products$`, `invoices$`), configurar filtros de busca e disparar o fluxo assíncrono de impressão.
2. **`ngOnDestroy`:**
   - Utilizado junto ao operador RxJS `takeUntil(this.destroy$)` e `Subject<void>`.
   - Garante o cancelamento de subscrições ativas e liberação de memória quando os componentes são destruídos pela navegação de rotas.
3. **`constructor` com Injeção de Dependência via `inject()`:**
   - Adoção da moderna função `inject(ProductService)`, padrão nos componentes Standalone do Angular moderno.
4. **Ciclo de Detecção de Mudanças via `AsyncPipe` (`| async`):**
   - Os templates consom Observables diretamente através do pipe `| async`, delegando ao Angular o gerenciamento automático de `subscribe` e `unsubscribe` alinhado ao ciclo de vida da view.

---

### 2.2 Se foi feito uso da biblioteca RxJS e, em caso afirmativo, como?
**Sim, o RxJS é a espinha dorsal de todo o gerenciamento de estado e fluxo de dados da aplicação.**
- **`BehaviorSubject` (`productsSubject`, `invoicesSubject`, `toastsSubject`):**
  - Mantém o estado atualizado em memória e emite imediatamente o valor mais recente para novos componentes assinantes.
- **`combineLatest`:**
  - Utilizado no Dashboard e nas tabelas para combinar o fluxo de produtos/notas com os fluxos de filtros e buscas do formulário em tempo real.
- **`map` & `tap`:**
  - Utilizados nos pipes para transformar dados (cálculo de totais, contagem de status, ordenação e sincronização com `localStorage`).
- **`switchMap` & `catchError` / `throwError` / `of`:**
  - Utilizados no encadeamento das operações de validação de saldo e baixa de estoque atômica, tratando erros de negócio e disparando notificações.
- **`takeUntil` & `Subject`:**
  - Padrão de cancelamento determinístico de subscrições para prevenção de *memory leaks*.

---

### 2.3 Quais outras bibliotecas foram utilizadas e para qual finalidade?
- **`canvas-confetti`:**
  - Responsável pela animação de confetes celebratórios no momento da conclusão bem-sucedida da impressão e fechamento da Nota Fiscal.
- **`@angular/forms` (`ReactiveFormsModule`):**
  - Para gerenciamento reativo e tipado de formulários com validações síncronas (`Validators.required`, `Validators.min(0)`).
- **`@angular/router`:**
  - Roteamento SPA com rotas parametrizadas, lazy-ready e títulos de página dinâmicos.

---

### 2.4 Para componentes visuais, quais bibliotecas foram utilizadas?
- **Design System Customizado com CSS Moderno:**
  - Paleta baseada em variáveis HSL (Slate corporativo, Brand Blues, Emerald de sucesso e Amber de atenção).
  - Componentes construídos com padrões semânticos de alta performance (Cards, Badges pulsantes, Modais com Glassmorphism, Tabelas responsivas).
- **`AppIcon` (SVG Component Engine):**
  - Componente Angular standalone próprio baseado nas especificações SVG da biblioteca **Lucide Icons**, garantindo nitidez vetorial sem peso de fontes externas e sem falhas de carregamento de assets.
- **Google Fonts (Inter & Plus Jakarta Sans):**
  - Tipografia corporativa moderna com kerning e tracking calibrados para legibilidade.
- **Módulo de Impressão `@media print`:**
  - Folha de estilo dedicada para renderização fiel do layout DANFE em folhas A4 / PDF.

---

### 2.5 Como foi realizado o gerenciamento de dependências no Golang (se aplicável)?
- Em projetos Golang, o gerenciamento é realizado nativamente pelo **Go Modules** (`go.mod` e `go.sum`).
- **Comandos Principais:**
  - `go mod init <module_path>`: Inicializa o módulo do projeto.
  - `go get <package_url>`: Adiciona uma dependência externa (ex: `go get -u github.com/gin-gonic/gin`).
  - `go mod tidy`: Remove dependências não utilizadas e adiciona as necessárias, mantendo o arquivo `go.sum` sincronizado com os hashes criptográficos de integridade.
  - `go mod vendor` (opcional): Empacota as dependências localmente para builds herméticos em ambientes isolados/CI/CD.

---

### 2.6 Quais frameworks foram utilizados no Golang ou C#?

#### Em C# (.NET):
- **ASP.NET Core Web API:** Framework de alta performance para criação dos endpoints RESTful.
- **Entity Framework Core (EF Core):** ORM para mapeamento objeto-relacional com migrações de banco de dados.
- **FluentValidation:** Para validação declarativa e isolada das regras de negócio de produtos e notas.
- **MediatR:** Implementação do padrão CQRS (Commands & Queries) para desacoplamento de handlers de emissão fiscal.

#### Em Golang:
- **Gin Web Framework** (ou **Fiber**): Framework HTTP rápido e minimalista com roteamento e middlewares.
- **GORM** ou **pgx/v5**: Camada de persistência relacional com suporte nativo a transações atômicas ACID (`tx.Begin()`, `tx.Commit()`, `tx.Rollback()`).

---

### 2.7 Como foram tratados os erros e exceções no backend?

#### Padrão em C# (.NET):
- **Global Exception Middleware:** Captura centralizada de exceções não tratadas retornando o padrão RFC 7807 (`ProblemDetails` com código HTTP apropriado, timestamp e mensagem legível).
- **Exceções Customizadas de Domínio:** `InsufficientStockException`, `InvoiceAlreadyClosedException`, `DuplicateProductCodeException`.
- **Transações de Banco de Dados:** O fechamento da nota e a dedução de saldo de todos os produtos ocorrem dentro de uma transação `using var tx = await context.Database.BeginTransactionAsync();`. Se qualquer item falhar, a transação sofre Rollback completo.

#### Padrão em Golang:
- **Tratamento Idiomático Explícito:** Retorno explícito de erro nas funções `(value, error)`.
- **Custom Error Types & Sentinels:** `var ErrInsufficientStock = errors.New("estoque insuficiente para o produto")`.
- **Middlewares de Recovery:** Recuperação de *panics* no Gin (`gin.Recovery()`) convertendo em respostas JSON 500 padronizadas.

---

### 2.8 Caso a implementação utilize C#, indicar se foi utilizado LINQ e de que forma.
**O LINQ (Language Integrated Query) é amplamente utilizado em consultas, validações e transformações de dados:**
1. **Validação de Estoque com `.All()` e `.Any()`:**
   ```csharp
   // Verifica atomicamente se todos os itens da nota possuem saldo suficiente no banco
   bool todosComSaldo = notaFiscal.Itens.All(item =>
       _context.Produtos.Any(p => p.Id == item.ProdutoId && p.Saldo >= item.Quantidade)
   );
   ```
2. **Atualização em Lote de Saldo com `.ForEach()` ou `Join`:**
   ```csharp
   var produtosAtualizados = await _context.Produtos
       .Where(p => idsProdutosDaNota.Contains(p.Id))
       .ToListAsync();

   foreach (var item in notaFiscal.Itens)
   {
       var produto = produtosAtualizados.First(p => p.Id == item.ProdutoId);
       produto.Saldo -= item.Quantidade; // Ex: 10 - 2 = 8
   }
   ```
3. **Filtros e Projeção DTO com `.Where()` e `.Select()`:**
   ```csharp
   var notasAbertas = await _context.NotasFiscais
       .Where(nf => nf.Status == StatusNota.Aberta)
       .OrderByDescending(nf => nf.DataEmissao)
       .Select(nf => new NotaFiscalResponseDto {
           Numero = nf.Numero,
           Total = nf.Itens.Sum(i => i.Quantidade * i.PrecoUnitario),
           Status = nf.Status.ToString()
       })
       .ToListAsync();
   ```

---

## 🎬 3. Roteiro Passo a Passo para Gravação do Vídeo

| Minuto | Etapa | O que mostrar na tela | O que falar |
|---|---|---|---|
| **00:00 - 00:45** | **Apresentação** | Tela de Dashboard do Korp Fiscal | Apresentar seu nome, o objetivo do projeto e a visão geral dos módulos (Dashboard, Produtos, Notas Fiscais e Detalhamento Técnico). |
| **00:45 - 01:30** | **Cadastro de Produtos** | Menu "Cadastro de Produtos" $\rightarrow$ Clicar em "Novo Produto" | Mostrar a tabela de produtos cadastrados com código, descrição e saldo (ex: Notebook Dell com saldo inicial 10). Cadastrar um novo item demonstrando as validações de campos obrigatórios. |
| **01:30 - 02:30** | **Emissão de Nota Fiscal** | Menu "Nova Nota Fiscal" | Demonstrar a numeração sequencial gerada automaticamente, o status inicial "Aberta" e a inclusão de múltiplos produtos. Tentar colocar uma quantidade maior que o saldo para mostrar a validação em tempo real. Salvar a nota. |
| **02:30 - 03:45** | **Impressão e Baixa de Estoque** | Menu "Notas Fiscais" $\rightarrow$ Botão "Imprimir" | 1. Mostrar o botão de impressão visível na linha da nota.<br>2. Clicar no botão e mostrar a barra de processamento.<br>3. Mostrar que o status mudou para **Fechada** e o botão de impressão foi bloqueado.<br>4. Voltar na tela de Produtos e comprovar que o saldo caiu de 10 para 8 unidades.<br>5. Abrir a visualização do DANFE formatado. |
| **03:45 - 05:00** | **Detalhamento Técnico** | Menu "Detalhamento Técnico" | Explicar os ciclos de vida (`ngOnInit`, `ngOnDestroy`), a reatividade com RxJS (`BehaviorSubject`, `combineLatest`), as bibliotecas, a arquitetura de backend Golang/C#, LINQ e tratamento de exceções. |
