import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-tech-details',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="space-y-6 max-w-6xl mx-auto animate-fade-in pb-16">
      
      <!-- Tech Overview Banner -->
      <div class="bg-gradient-to-br from-slate-900 via-slate-850 to-brand-950 rounded-2xl p-6 lg:p-8 text-white shadow-xl border border-slate-800">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2 max-w-3xl">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/30 text-brand-200 border border-brand-400/30">
                Apresentação Técnica do Projeto
              </span>
              <span class="text-xs text-slate-400 font-mono">Angular 19/22 + RxJS + Clean Architecture</span>
            </div>
            <h1 class="text-2xl lg:text-3xl font-extrabold tracking-tight text-white font-display">
              Detalhamento Técnico da Solução
            </h1>
            <p class="text-xs lg:text-sm text-slate-300 leading-relaxed">
              Documentação técnica estruturada e fundamentada para a demonstração e gravação do vídeo do
              <strong>Sistema de Emissão de Notas Fiscais (Korp Fiscal)</strong>.
            </p>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0">
            <button type="button" class="btn btn-primary btn-sm bg-brand-500 hover:bg-brand-400 border-none" (click)="activeTab = 'script'">
              <app-icon name="eye" [size]="16"></app-icon>
              <span>Roteiro para Gravação</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="card-surface p-1.5 flex flex-wrap gap-1.5 overflow-x-auto">
        <button
          *ngFor="let tab of tabs"
          type="button"
          (click)="activeTab = tab.id"
          class="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
          [ngClass]="
            activeTab === tab.id
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          "
        >
          <app-icon [name]="tab.icon" [size]="15"></app-icon>
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- TAB 1: CICLOS DE VIDA DO ANGULAR -->
      <div *ngIf="activeTab === 'lifecycle'" class="space-y-6 animate-fade-in">
        <div class="card-surface p-6 lg:p-8">
          <div class="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
            <div class="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <app-icon name="layers" [size]="20"></app-icon>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900">1. Ciclos de Vida do Angular Utilizados</h2>
              <p class="text-xs text-slate-500">Garantia de inicialização determinística, reatividade e prevenção de memory leaks</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <!-- OnInit -->
            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div class="flex items-center gap-2 mb-2">
                <span class="font-mono font-bold text-xs bg-brand-100 text-brand-800 px-2 py-0.5 rounded">ngOnInit()</span>
                <span class="text-xs font-semibold text-slate-700">Inicialização de Componente</span>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Utilizado nos componentes <code class="font-mono text-brand-700">DashboardComponent</code>,
                <code class="font-mono text-brand-700">ProductsComponent</code>,
                <code class="font-mono text-brand-700">InvoicesListComponent</code> e
                <code class="font-mono text-brand-700">PrintModalComponent</code> para configurar subscrições RxJS reativas,
                carregar dados persistidos e inicializar o stepper de emissão fiscal.
              </p>
            </div>

            <!-- OnDestroy -->
            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div class="flex items-center gap-2 mb-2">
                <span class="font-mono font-bold text-xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded">ngOnDestroy()</span>
                <span class="text-xs font-semibold text-slate-700">Descarte & Memory Management</span>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Implementado com o padrão <code class="font-mono text-brand-700">Subject destroy$</code> e o operador
                <code class="font-mono text-brand-700">takeUntil(this.destroy$)</code> para cancelar todas as assinaturas abertas
                quando o componente sai da visualização, evitando vazamento de memória.
              </p>
            </div>

            <!-- Dependency Injection via inject() -->
            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div class="flex items-center gap-2 mb-2">
                <span class="font-mono font-bold text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">inject() + DI</span>
                <span class="text-xs font-semibold text-slate-700">Injeção Moderna Standalone</span>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Uso da moderna API <code class="font-mono text-brand-700">inject(ProductService)</code> do Angular Standalone,
                permitindo instâncias tipadas, desacopladas e testáveis de serviços de domínio.
              </p>
            </div>

            <!-- Async Pipe & CD -->
            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div class="flex items-center gap-2 mb-2">
                <span class="font-mono font-bold text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Async Pipe</span>
                <span class="text-xs font-semibold text-slate-700">Ciclo de Renderização Reativo</span>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                O ciclo de renderização no template utiliza predominantemente o pipe <code class="font-mono text-brand-700">| async</code>,
                o que delega ao framework o gerenciamento automático de subscrição e cancelamento junto à detecção de mudanças.
              </p>
            </div>

          </div>
        </div>
      </div>

      <!-- TAB 2: RXJS NA PRÁTICA -->
      <div *ngIf="activeTab === 'rxjs'" class="space-y-6 animate-fade-in">
        <div class="card-surface p-6 lg:p-8">
          <div class="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
            <div class="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <app-icon name="code" [size]="20"></app-icon>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900">2. Uso da Biblioteca RxJS</h2>
              <p class="text-xs text-slate-500">Arquitetura reativa de ponta a ponta para gerenciamento de estado e fluxos assíncronos</p>
            </div>
          </div>

          <div class="space-y-4">
            
            <div class="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
              <span class="text-brand-400 font-bold">// Exemplo de fluxo atômico com RxJS no InvoiceService:</span>
              <pre class="mt-2 text-slate-300"><code>{{ rxjsSnippet }}</code></pre>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div class="p-4 rounded-xl border border-slate-200">
                <strong class="text-brand-700 block mb-1">BehaviorSubject</strong>
                <p class="text-slate-600">
                  Mantém o estado atual da lista de produtos e notas fiscais em memória com emissão imediata do último valor para novos assinantes.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-slate-200">
                <strong class="text-brand-700 block mb-1">combineLatest & map</strong>
                <p class="text-slate-600">
                  Combina fluxos de produtos e notas fiscais no Dashboard e na busca em tempo real para recalcular KPIs e filtros instantaneamente.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-slate-200">
                <strong class="text-brand-700 block mb-1">takeUntil & Subject</strong>
                <p class="text-slate-600">
                  Garante o descarte limpo de subscrições quando os componentes são destruídos pelo roteador do Angular.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- TAB 3: BIBLIOTECAS E COMPONENTES VISUAIS -->
      <div *ngIf="activeTab === 'libs'" class="space-y-6 animate-fade-in">
        <div class="card-surface p-6 lg:p-8">
          <div class="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
            <div class="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <app-icon name="sparkles" [size]="20"></app-icon>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900">3. Bibliotecas & Componentes Visuais Utilizados</h2>
              <p class="text-xs text-slate-500">Ecossistema de alta performance, sem peso excessivo e com controle fino de UI</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h4 class="font-bold text-slate-900 text-sm mb-1">Angular Standalone & Forms</h4>
              <p class="text-xs text-slate-600">
                <code class="text-brand-700 font-mono">ReactiveFormsModule</code> com <code class="text-brand-700 font-mono">FormBuilder</code>,
                <code class="text-brand-700 font-mono">Validators</code> e validações customizadas em tempo real para controle de estoque.
              </p>
            </div>

            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h4 class="font-bold text-slate-900 text-sm mb-1">Canvas Confetti</h4>
              <p class="text-xs text-slate-600">
                Biblioteca para micro-interação celebratória após a impressão e fechamento com sucesso da Nota Fiscal.
              </p>
            </div>

            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h4 class="font-bold text-slate-900 text-sm mb-1">Design System Customizado</h4>
              <p class="text-xs text-slate-600">
                Tokens CSS em HSL, Glassmorphism, Badges com animação de pulso, modais acessíveis e suporte nativo a impressão fiscal.
              </p>
            </div>

            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h4 class="font-bold text-slate-900 text-sm mb-1">AppIcon (SVG Engine)</h4>
              <p class="text-xs text-slate-600">
                Componente SVG próprio baseado na especificação Lucide para renderização vetorial cristalina sem requisições HTTP adicionais.
              </p>
            </div>

            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h4 class="font-bold text-slate-900 text-sm mb-1">Google Fonts (Inter & Jakarta)</h4>
              <p class="text-xs text-slate-600">
                Tipografia corporativa moderna de alta legibilidade para dashboards e sistemas ERP.
              </p>
            </div>

            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h4 class="font-bold text-slate-900 text-sm mb-1">Toast & Stepper Notification</h4>
              <p class="text-xs text-slate-600">
                Sistema próprio reativo de toasts flutuantes e indicador com barra de progresso durante o fluxo de impressão.
              </p>
            </div>

          </div>
        </div>
      </div>

      <!-- TAB 4: BACKEND GOLANG & C# ARCHITECTURE -->
      <div *ngIf="activeTab === 'backend'" class="space-y-6 animate-fade-in">
        <div class="card-surface p-6 lg:p-8">
          <div class="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
            <div class="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <app-icon name="shield" [size]="20"></app-icon>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900">4. Backend Golang / C# .NET & Tratamento de Erros</h2>
              <p class="text-xs text-slate-500">Respostas aos requisitos técnicos de arquitetura backend e LINQ</p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <!-- C# .NET & LINQ Section -->
            <div class="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-slate-900 text-sm">C# .NET (ASP.NET Core & LINQ)</h3>
                <span class="badge badge-info text-[10px]">.NET 8 / 9</span>
              </div>

              <div class="space-y-2 text-xs text-slate-600">
                <p><strong>● Frameworks:</strong> ASP.NET Core Web API, Entity Framework Core, FluentValidation, MediatR (CQRS).</p>
                <p><strong>● Uso do LINQ:</strong> Utilizado intensamente para consulta, validação de saldo e projeção de DTOs:</p>
              </div>

              <div class="bg-slate-900 text-slate-200 font-mono text-[11px] p-3 rounded-lg overflow-x-auto">
                <pre><code>{{ csharpSnippet }}</code></pre>
              </div>

              <p class="text-xs text-slate-600">
                <strong>● Tratamento de Erros:</strong> Global Exception Middleware (<code class="font-mono text-brand-700">ProblemDetails</code> RFC 7807),
                transações atômicas com <code class="font-mono text-brand-700">BeginTransactionAsync()</code> no fechamento da nota.
              </p>
            </div>

            <!-- Golang Section -->
            <div class="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-slate-900 text-sm">Golang (Go Modules & Clean Arch)</h3>
                <span class="badge badge-info text-[10px]">Go 1.22+</span>
              </div>

              <div class="space-y-2 text-xs text-slate-600">
                <p><strong>● Gerenciamento de Dependências:</strong> Realizado via <code class="font-mono text-brand-700">go mod init</code> e <code class="font-mono text-brand-700">go.mod / go.sum</code> para controle determinístico e semântico de versões.</p>
                <p><strong>● Frameworks:</strong> Gin Web Framework ou Fiber, GORM / pgx para PostgreSQL.</p>
                <p><strong>● Tratamento de Erros:</strong> Erros explícitos idiomáticos em Go (<code class="font-mono text-brand-700">if err != nil</code>), com structs customizadas de erro de domínio:</p>
              </div>

              <div class="bg-slate-900 text-slate-200 font-mono text-[11px] p-3 rounded-lg overflow-x-auto">
                <pre><code>{{ golangSnippet }}</code></pre>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- TAB 5: ROTEIRO PARA VÍDEO -->
      <div *ngIf="activeTab === 'script'" class="space-y-6 animate-fade-in">
        <div class="card-surface p-6 lg:p-8">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <app-icon name="eye" [size]="20"></app-icon>
              </div>
              <div>
                <h2 class="text-lg font-bold text-slate-900">Roteiro Estruturado para Gravação do Vídeo</h2>
                <p class="text-xs text-slate-500">Guia passo a passo pronto para falar e demonstrar no vídeo</p>
              </div>
            </div>
            <span class="badge badge-closed text-xs">Tempo Sugerido: 3 a 5 min</span>
          </div>

          <div class="space-y-4 text-xs text-slate-700">
            
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 class="font-bold text-slate-900 text-sm mb-1">⏱️ Minuto 00:00 a 01:00 - Introdução e Telas Desenvolvidas</h4>
              <p class="leading-relaxed">
                "Olá! Neste vídeo apresento a solução completa do <strong>Sistema de Emissão de Notas Fiscais</strong> desenvolvido em Angular.
                Apresento a tela de <strong>Dashboard</strong> com visão consolidada, a tela de <strong>Cadastro de Produtos</strong> com controle rigoroso de saldo em estoque,
                a tela de <strong>Listagem de Notas Fiscais</strong> e o formulário de <strong>Nova Nota Fiscal</strong> com inclusão de múltiplos produtos."
              </p>
            </div>

            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 class="font-bold text-slate-900 text-sm mb-1">⏱️ Minuto 01:00 a 02:30 - Demonstração Prática dos Requisitos</h4>
              <ul class="list-disc pl-5 space-y-1 leading-relaxed">
                <li><strong>1. Cadastro de Produto:</strong> Mostrar o cadastro do produto com Código, Descrição e Saldo (ex: Notebook Dell com saldo inicial 10).</li>
                <li><strong>2. Cadastro de Nota Fiscal:</strong> Criar uma nova nota com numeração sequencial automática (#1003) e status inicial 'Aberta', adicionando múltiplos produtos (ex: 2 unidades do Notebook).</li>
                <li><strong>3. Impressão da Nota Fiscal:</strong> Clicar no botão 'Imprimir' na linha da nota. Mostrar o indicador de processamento com a barra de progresso.</li>
                <li><strong>4. Atualização de Status e Saldo:</strong> Demonstrar que a nota mudou automaticamente para 'Fechada', o botão de impressão foi bloqueado e o saldo do produto caiu de 10 para 8 unidades (conforme o exemplo do enunciado!).</li>
                <li><strong>5. Visualização do DANFE:</strong> Abrir o modal formatado do DANFE para impressão real.</li>
              </ul>
            </div>

            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 class="font-bold text-slate-900 text-sm mb-1">⏱️ Minuto 02:30 a 04:00 - Detalhamento Técnico</h4>
              <ul class="list-disc pl-5 space-y-1 leading-relaxed">
                <li><strong>Ciclos de Vida:</strong> Explicar o uso de <code class="font-mono text-brand-700">ngOnInit</code> para setup reativo e <code class="font-mono text-brand-700">ngOnDestroy</code> com <code class="font-mono text-brand-700">takeUntil</code> para descarte de subscrições.</li>
                <li><strong>RxJS:</strong> Explicar o uso de <code class="font-mono text-brand-700">BehaviorSubject</code> para reatividade de estado, <code class="font-mono text-brand-700">combineLatest</code> para filtros/dashboard e pipes com <code class="font-mono text-brand-700">map/tap/catchError</code>.</li>
                <li><strong>Bibliotecas e Componentes:</strong> Reactive Forms, Canvas Confetti, Design System CSS e componentes Standalone com AppIcon SVG.</li>
                <li><strong>Backend Golang & C#:</strong> Go Modules com Gin e controle de transações; C# com ASP.NET Core, LINQ para filtros e Exception Middleware.</li>
              </ul>
            </div>

          </div>
        </div>
      </div>

    </div>
  `,
})
export class TechDetailsComponent {
  public activeTab: 'lifecycle' | 'rxjs' | 'libs' | 'backend' | 'script' = 'lifecycle';

  public tabs: { id: 'lifecycle' | 'rxjs' | 'libs' | 'backend' | 'script'; label: string; icon: string }[] = [
    { id: 'lifecycle', label: '1. Ciclos de Vida Angular', icon: 'layers' },
    { id: 'rxjs', label: '2. Uso do RxJS', icon: 'code' },
    { id: 'libs', label: '3. Bibliotecas & UI', icon: 'sparkles' },
    { id: 'backend', label: '4. Backend Golang / C# LINQ', icon: 'shield' },
    { id: 'script', label: '5. Roteiro para o Vídeo', icon: 'eye' },
  ];

  public rxjsSnippet = `public processAndPrintInvoice(invoiceId: string): Observable<Invoice> {
  return this.productService.deductStockForInvoice(invoice.id, invoice.number, itemsToDeduct).pipe(
    map(() => {
      const updatedInvoice: Invoice = {
        ...currentInvoice,
        status: 'Fechada',
        closedDate: new Date().toISOString()
      };
      this.persistInvoices([...updatedList]);
      return updatedInvoice;
    }),
    catchError((err) => throwError(() => new Error(err.message)))
  );
}`;

  public csharpSnippet = `// 1. Verificação com LINQ se todos os produtos possuem saldo suficiente:
var hasStock = invoice.Items.All(i => 
    _context.Products.Any(p => p.Id == i.ProductId && p.Stock >= i.Quantity));

// 2. Projeção, agrupamento e filtragem com LINQ:
var summary = await _context.Invoices
    .Where(i => i.Status == InvoiceStatus.Aberta)
    .GroupBy(i => i.CustomerDocument)
    .Select(g => new { Doc = g.Key, Total = g.Sum(x => x.TotalAmount) })
    .ToListAsync();`;

  public golangSnippet = `// Validação e baixa atômica de estoque em Go com transação:
func (s *InvoiceService) ProcessPrint(ctx context.Context, id string) error {
    tx := s.db.Begin()
    defer tx.Rollback()

    var inv Invoice
    if err := tx.First(&inv, "id = ? AND status = ?", id, "Aberta").Error; err != nil {
        return ErrInvoiceNotOpen
    }

    for _, item := range inv.Items {
        res := tx.Model(&Product{}).
            Where("id = ? AND stock >= ?", item.ProductID, item.Quantity).
            Update("stock", gorm.Expr("stock - ?", item.Quantity))
        if res.RowsAffected == 0 {
            return ErrInsufficientStock
        }
    }
    return tx.Commit().Error
}`;
}
