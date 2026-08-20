using Microsoft.AspNetCore.Mvc;
using ServicoFaturamento.API.Models;
using ServicoFaturamento.API.Services;

namespace ServicoFaturamento.API.Controllers;

[ApiController]
[Route("api/notas-fiscais")]
public class FaturamentoController : ControllerBase
{
    private readonly IFaturamentoService _faturamentoService;

    //Construtor
    public FaturamentoController(IFaturamentoService faturamentoService)
    {
        _faturamentoService = faturamentoService;
    }

    //Rota get para buscar lista de todas as notas fiscais
    [HttpGet]
    public async Task<IActionResult> ObterNotas()
    {
        var notas = await _faturamentoService.ObterNotas();
        return Ok(notas);
    }

    //Rota get de busca por ID de nota
    [HttpGet("{id:int}")]
    public async Task<IActionResult> ObterNotaPorId(int id)
    {
        var nota = await _faturamentoService.ObterNotaPorId(id);

        if (nota is null)
        {
            return NotFound($"Nota fiscal com Id {id} não encontrada.");
        }

        return Ok(nota);
    }

    //Rota post de cadastro de produto
    [HttpPost]
    public async Task<IActionResult> CadastrarNota([FromBody] NotaFiscal notaFiscal)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var notaCriada = await _faturamentoService.CadastrarNota(notaFiscal);
            return CreatedAtAction(nameof(ObterNotaPorId), new { id = notaCriada.Id }, notaCriada);
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    
    //Rota patch/post de alterar o status da nota e debitar estoque (Impressão / Fechamento)
    [HttpPatch("{id:int}/status")]
    [HttpPost("{id:int}/imprimir")]
    [HttpPut("{id:int}/fechar")]
    public async Task<IActionResult> AlterarStatus(int id)
    {
        try
        {
            var nota = await _faturamentoService.AlterarStatus(id);

            if (nota is null)
            {
                return NotFound(new { message = $"Nota fiscal com Id {id} não encontrada." });
            }

            return Ok(nota);
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    //Rota delete de excluir nota
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeletarNota(int id)
    {
        var deletado = await _faturamentoService.DeletarNota(id);

        if (!deletado)
        {
            return NotFound($"Nota fiscal com Id {id} não encontrada.");
        }

        return NoContent();
    }
}