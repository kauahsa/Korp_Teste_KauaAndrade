#nullable enable
using Microsoft.EntityFrameworkCore;
using ServicoEstoque.API.Data;
using ServicoEstoque.API.Models;

namespace ServicoEstoque.API.Services;

public class EstoqueService : IEstoqueService
{
    private readonly EstoqueDbContext _estoqueDbContext;

    //Construtor
    public EstoqueService(EstoqueDbContext estoqueDbContext)
    {
        _estoqueDbContext = estoqueDbContext;
    }

    //Listagem de Produtos
    public async Task<List<Produto>> ObterProdutos()
    {
        return await _estoqueDbContext.Produtos.ToListAsync();
    }

    //Busca por id
    public async Task<Produto?> ObterProdutoPorId(int id)
    {
        return await _estoqueDbContext.Produtos.FindAsync(id);
    }

    //Busca por codigo
    public async Task<Produto?> ObterProdutoPorCodigo(string codigo)
    {
        return await _estoqueDbContext.Produtos.FirstOrDefaultAsync(p => p.Codigo == codigo);
    }

    //Cadastro de Produto
    public async Task<Produto> CadastrarProduto(Produto produto)
    {
        _estoqueDbContext.Produtos.Add(produto);
        await _estoqueDbContext.SaveChangesAsync();
        return produto;
    }

    //Editar Produto 
    public async Task<Produto?> EditarProduto(int id, Produto produtoAtualizado)
    {
        var produto = await _estoqueDbContext.Produtos.FindAsync(id);
        if (produto is null)
        {
            return null;
        }

        produto.Codigo = produtoAtualizado.Codigo;
        produto.Descricao = produtoAtualizado.Descricao;
        produto.QuantidadeEstoque = produtoAtualizado.QuantidadeEstoque;

        await _estoqueDbContext.SaveChangesAsync();
        return produto;
    }

    //Excluir Produto
    public async Task<bool> ExcluirProduto(int id)
    {
        var existeProduto = await _estoqueDbContext.Produtos.FindAsync(id);
        if (existeProduto is null)
        {
            return false;
        }

        _estoqueDbContext.Produtos.Remove(existeProduto);
        await _estoqueDbContext.SaveChangesAsync();
        return true;
    }

    //Debitar Estoque
    public async Task<bool> DebitarEstoque(int id, int quantidade)
    {
        var produto = await _estoqueDbContext.Produtos.FindAsync(id);
        if (produto is null || produto.QuantidadeEstoque < quantidade)
        {
            return false;
        }

        produto.QuantidadeEstoque -= quantidade;
        await _estoqueDbContext.SaveChangesAsync();
        return true;
    }
}