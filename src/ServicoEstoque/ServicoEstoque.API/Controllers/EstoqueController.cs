using Microsoft.AspNetCore.Mvc;
using ServicoEstoque.API.Services;
using ServicoEstoque.API.Models;

namespace ServicoEstoque.API.Controllers;

[ApiController]
[Route("api/produtos/")]
public class EstoqueController : ControllerBase
{
    private readonly IEstoqueService _estoqueService;

    public EstoqueController(IEstoqueService service)
    {
        _estoqueService = service;
    }
    
    //Rota get para buscar lista de todos os Produtos
    [HttpGet]
    public async Task<IActionResult> ListarProdutos()
    {   
        var produtos = await _estoqueService.ObterProdutos();
        return Ok(produtos);
    
    }
    
    //Rota get de busca por ID de produto
    [HttpGet("{id:int}")]
    public async Task<IActionResult> ListarProdutoPorId(int id)
    {
        var produto =  await _estoqueService.ObterProdutoPorId(id);
        if (produto is null)
        {
            return NotFound("Produto não encontrado");
        }
        return Ok(produto);
    }
    
    //Rota get de busca por Codigo de produto
    [HttpGet("{codigo}")]
    public async Task<IActionResult> ListarProdutoPorCodigo(string codigo)
    {
        var produto =  await _estoqueService.ObterProdutoPorCodigo(codigo);
        if (produto is null)
        {
            return NotFound("Produto não encontrado");
        }
        return Ok(produto);
    }
    
    //Rota post de cadastro de produto
    [HttpPost]
    public async Task<IActionResult> CadastrarProduto(Produto produto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var resultado = await _estoqueService.CadastrarProduto(produto);
            return CreatedAtAction(nameof(ListarProdutoPorId), new { id = resultado.Id }, resultado);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    
    //Rota Put de editar produto
    [HttpPut("{id:int}")]
    public async Task<IActionResult> EditarProduto(int id, [FromBody] Produto produtoAtualizado)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var produto = await _estoqueService.EditarProduto(id, produtoAtualizado);

            if (produto is null)
            {
                return NotFound(new { message = $"Produto com Id {id} não encontrado." });
            }

            return Ok(produto);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    
    //Rota Delete de deletar produto
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeletarProduto(int id)
    {
        var deletado = await _estoqueService.ExcluirProduto(id);

        if (!deletado)
        {
            return NotFound($"Produto com Id {id} não encontrado.");
        }

        return NoContent();
    }

    //Rota Post de debitar estoque
    [HttpPost("{id:int}/debitar-estoque")]
    public async Task<IActionResult> DebitarEstoque(int id, [FromBody] DebitarEstoqueDto dto)
    {
        if (dto.Quantidade <= 0)
        {
            return BadRequest("A quantidade para debitar deve ser maior que zero.");
        }

        var sucesso = await _estoqueService.DebitarEstoque(id, dto.Quantidade);
        if (!sucesso)
        {
            return BadRequest($"Saldo insuficiente ou produto com Id {id} não encontrado.");
        }

        var produtoAtualizado = await _estoqueService.ObterProdutoPorId(id);
        return Ok(produtoAtualizado);
    }

    //Rota Post de estornar/creditar estoque (Ação Compensatória)
    [HttpPost("{id:int}/estornar-estoque")]
    public async Task<IActionResult> EstornarEstoque(int id, [FromBody] DebitarEstoqueDto dto)
    {
        if (dto.Quantidade <= 0)
        {
            return BadRequest("A quantidade para estornar deve ser maior que zero.");
        }

        var sucesso = await _estoqueService.EstornarEstoque(id, dto.Quantidade);
        if (!sucesso)
        {
            return NotFound($"Produto com Id {id} não encontrado para estorno.");
        }

        var produtoAtualizado = await _estoqueService.ObterProdutoPorId(id);
        return Ok(produtoAtualizado);
    }
}

