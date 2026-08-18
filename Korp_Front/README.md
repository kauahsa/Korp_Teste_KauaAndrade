# Korp Fiscal — Sistema de Emissão de Notas Fiscais

Aplicação moderna em **Angular Standalone** desenvolvida para atender integralmente ao projeto técnico de **Emissão de Notas Fiscais e Controle de Estoque**.

---

## Funcionalidades Implementadas

1. **Cadastro de Produtos:**
   - Campos obrigatórios: Código, Descrição e Saldo (quantidade disponível em estoque).
   - Validações de código único, saldo positivo, listagem com busca e filtros reativos.
   - Histórico de movimentações de estoque em tempo real.

2. **Cadastro de Notas Fiscais:**
   - Numeração sequencial gerada automaticamente (`NF-001001`, `NF-001002`...).
   - Status inicial obrigatório: **Aberta**.
   - Inclusão de múltiplos produtos com quantidades e verificação instantânea de saldo em estoque.
   - Cálculo automático de subtotais e valor total da nota.

3. **Impressão de Notas Fiscais:**
   - Botão de impressão visível, intuitivo e com destaque visual em tela.
   - Ao clicar: exibe **indicador de processamento** com barra de progresso visual.
   - Ao concluir: atualiza o status da nota para **Fechada**.
   - **Bloqueio de segurança:** Não permite a impressão de notas com status diferente de "Aberta".
   - **Atualização atômica de saldo:** Debita do estoque as quantidades utilizadas em cada item da nota (Ex: saldo anterior = 10; nota utiliza 2 -> novo saldo = 8).
   - Visualizador de **DANFE formatado** pronto para impressão direta (`window.print()`).

4. **Detalhamento Técnico Integrado:**
   - Página interativa dedicada dentro da própria aplicação contendo todas as explicações técnicas necessárias para a gravação do vídeo (Ciclos de Vida, RxJS, Bibliotecas, Backend Golang/C#, LINQ e Tratamento de Exceções).
   - Arquivo [`DETALHAMENTO_TECNICO.md`](DETALHAMENTO_TECNICO.md) com roteiro completo de apresentação.

---

## Tecnologias Utilizadas

- **Framework:** Angular 19/22 (Componentes Standalone)
- **Linguagem:** TypeScript
- **Reatividade & Estado:** RxJS (`BehaviorSubject`, `combineLatest`, `map`, `tap`, `takeUntil`, etc.)
- **Formulários:** `@angular/forms` (`ReactiveFormsModule`, `FormBuilder`, `Validators`)
- **Estilização:** CSS Design System customizado (Tokens HSL, Glassmorphism, Layout DANFE `@media print`)
- **Ícones & Micro-interações:** Engine SVG Standalone (`AppIcon`) e `canvas-confetti`

---

## Como Executar o Projeto Localmente

1. **Instalar dependências (caso não tenha instalado):**
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
│   │   ├── models/           # Interfaces TypeScript (Product, Invoice, Toast, etc.)
│   │   └── services/         # Serviços de Domínio Reativos (ProductService, InvoiceService, ToastService)
│   ├── shared/
│   │   └── components/       # Componentes Compartilhados (Header, Sidebar, AppIcon, DanfePreview, PrintModal, Toast)
│   ├── pages/
│   │   ├── dashboard/        # Painel com KPIs, gráficos e ações rápidas
│   │   ├── products/         # Tela de Cadastro e Gestão de Produtos
│   │   ├── invoices/         # Listagem e Emissão de Notas Fiscais
│   │   └── tech-details/     # Detalhamento Técnico e Roteiro para Vídeo
│   ├── app.routes.ts         # Rotas da aplicação SPA
│   ├── app.ts / app.html     # Layout principal
│   └── app.config.ts         # Provedores da aplicação
├── styles.css                # Design System Global e Estilos @media print
└── index.html                # HTML Base com Google Fonts
```
