using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ServicoFaturamento.API.Models;

//Definindo Estrutura dos Produtos Das Notas Fiscais

public class NotaFiscalProduto
{
    public int Id { get; set; }

    public int NotaFiscalId { get; set; }
    
    [JsonIgnore]
    public NotaFiscal? NotaFiscal { get; set; }

    
    public int ProdutoId { get; set; }

    [MaxLength(100, ErrorMessage = "A descrição deve ter no máximo 100 caracteres!")]
    public string? DescricaoProduto { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "A quantidade deve ser maior que zero!")]
    public int Quantidade { get; set; }
}