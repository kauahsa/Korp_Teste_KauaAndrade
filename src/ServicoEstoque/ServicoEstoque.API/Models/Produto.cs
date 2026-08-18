#nullable enable
namespace ServicoEstoque.API.Models;
using System.ComponentModel.DataAnnotations;

//Definindo Estrutura dos Produtos
public class Produto
{
    public int Id { get; set; }
    
    [Required(ErrorMessage = "O codigo é obrigatório!")]
    [MaxLength(50, ErrorMessage = "O codigo deve conter no máximo 50 caracteres!")]
    public required string Codigo { get; set; }
    
    
    [MaxLength(100, ErrorMessage = "A descrição deve ter no máximo 100 caracteres!")]
    public string? Descricao{ get; set; }
    
    [Range(0, int.MaxValue, ErrorMessage = "A quantidade deve ser maior que zero!")]
    public int QuantidadeEstoque { get; set; }
    
    public DateTime DataRegistro { get; set; } = DateTime.UtcNow;
    
}