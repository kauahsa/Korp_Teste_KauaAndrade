namespace ServicoFaturamento.API.Models;

public class ProdutoEstoqueDto
{
    public int Id { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public int QuantidadeEstoque { get; set; }
}