using Microsoft.EntityFrameworkCore;
using ServicoEstoque.API.Models;

namespace ServicoEstoque.API.Data;

// Herdando propriedades do DbContext (Entity Framework)
public class EstoqueDbContext : DbContext
{
    public EstoqueDbContext(DbContextOptions<EstoqueDbContext> options) : base(options) { }

    // Criando tabela de produtos
    public DbSet<Produto> Produtos { get; set;}
}