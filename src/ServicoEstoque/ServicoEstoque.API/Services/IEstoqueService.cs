#nullable enable
using ServicoEstoque.API.Models;
namespace ServicoEstoque.API.Services;

public interface IEstoqueService
{
   Task<Produto?> ObterProdutoPorId(int id);
   Task<Produto?> ObterProdutoPorCodigo(string codigo);
   Task<List<Produto>> ObterProdutos(); 
   Task<Produto> CadastrarProduto(Produto produto);
   Task<Produto?> EditarProduto(int id, Produto produtoAtualizado);
   Task<bool> ExcluirProduto(int id);
   Task<bool> DebitarEstoque(int id, int quantidade);
}