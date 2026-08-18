#nullable enable
using ServicoFaturamento.API.Models;
namespace ServicoFaturamento.API.Services;

public interface IFaturamentoService
{
    Task<NotaFiscal?> ObterNotaPorId(int id);
    Task<List<NotaFiscal>> ObterNotas();
    Task<NotaFiscal> CadastrarNota(NotaFiscal notaFiscal);
    Task<NotaFiscal?> AlterarStatus(int id);
    Task<bool> DeletarNota(int id);
}