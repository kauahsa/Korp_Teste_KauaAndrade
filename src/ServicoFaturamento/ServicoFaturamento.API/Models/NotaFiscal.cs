#nullable enable
namespace ServicoFaturamento.API.Models;
using System.ComponentModel.DataAnnotations;

//Definindo Estrutura das NotasFiscais

public class NotaFiscal
{

    public int Id { get; set; }
    
    public int NumeroNota { get; set; }
    
    [Required (ErrorMessage = "Indique se a nota esta aberta ou fechada!")]
    public required StatusNotaFiscal Status { get; set; }
    
    public List<NotaFiscalProduto> Produtos { get; set; } = new();
    
    public DateTime DataRegistro { get; set; } = DateTime.UtcNow;
    
}