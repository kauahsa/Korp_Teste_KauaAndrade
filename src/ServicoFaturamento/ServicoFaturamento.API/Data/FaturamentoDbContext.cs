using Microsoft.EntityFrameworkCore;
using ServicoFaturamento.API.Models;

namespace ServicoFaturamento.API.Data;

// Herdando propriedades do DbContext (Entity Framework)
public class FaturamentoDbContext : DbContext
{ 
    public FaturamentoDbContext(DbContextOptions<FaturamentoDbContext> options) : base(options) { }
    
    // Criando tabela de Notas Fiscais
    public DbSet<NotaFiscal> NotasFiscais { get; set;}
    
    // Criando tabela de relação Nota <-> Produto
    public DbSet<NotaFiscalProduto> NotasFiscaisProdutos { get; set; }
    
}