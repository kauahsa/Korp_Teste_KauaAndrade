#nullable enable
using Microsoft.EntityFrameworkCore;
using ServicoFaturamento.API.Data;
using ServicoFaturamento.API.Models;

namespace ServicoFaturamento.API.Services;

public class FaturamentoService : IFaturamentoService
{
    private readonly FaturamentoDbContext _faturamentoDbContext;
    private readonly IHttpClientFactory _httpClientFactory;

    //Construtor
    public FaturamentoService(FaturamentoDbContext faturamentoDbContext, IHttpClientFactory httpClientFactory)
    {
        _faturamentoDbContext = faturamentoDbContext;
        _httpClientFactory = httpClientFactory;
    }

    //Cadastro de Nota
    public async Task<NotaFiscal> CadastrarNota(NotaFiscal notaFiscal)
    {
        if (!notaFiscal.Produtos.Any())
        {
            throw new InvalidOperationException("A nota fiscal deve ter pelo menos um produto.");
        }

        var httpClient = _httpClientFactory.CreateClient("EstoqueApi");

        foreach (var item in notaFiscal.Produtos)
        {
            var produto = await httpClient.GetFromJsonAsync<ProdutoEstoqueDto>($"/api/produtos/{item.ProdutoId}");

            if (produto is null)
            {
                throw new InvalidOperationException($"Produto com Id {item.ProdutoId} não encontrado no Estoque.");
            }

            // Preenche a descrição com o dado do Estoque
            item.DescricaoProduto = produto.Descricao;
        }

        var ultimoNumero = await _faturamentoDbContext.NotasFiscais.AnyAsync()
            ? await _faturamentoDbContext.NotasFiscais.MaxAsync(n => n.NumeroNota)
            : 0;

        notaFiscal.NumeroNota = ultimoNumero + 1;
        notaFiscal.Status = StatusNotaFiscal.Aberta;

        _faturamentoDbContext.NotasFiscais.Add(notaFiscal);
        await _faturamentoDbContext.SaveChangesAsync();
        return notaFiscal;
    }

    //Listagem de Notas com Produtos
    public async Task<List<NotaFiscal>> ObterNotas()
    {
        return await _faturamentoDbContext.NotasFiscais
            .Include(n => n.Produtos)
            .ToListAsync();
    }

    //Busca por id com Produtos
    public async Task<NotaFiscal?> ObterNotaPorId(int id)
    {
        return await _faturamentoDbContext.NotasFiscais
            .Include(n => n.Produtos)
            .FirstOrDefaultAsync(n => n.Id == id);
    }

    //Alterar status da nota (Aberta -> Fechada) e debitar estoque
    public async Task<NotaFiscal?> AlterarStatus(int id)
    {
        var nota = await _faturamentoDbContext.NotasFiscais
            .Include(n => n.Produtos)
            .FirstOrDefaultAsync(n => n.Id == id);

        if (nota is null)
        {
            return null;
        }

        if (nota.Status == StatusNotaFiscal.Fechada)
        {
            throw new InvalidOperationException("Apenas notas fiscais com status 'Aberta' podem ser impressas/fechadas. Esta nota já está fechada.");
        }

        var httpClient = _httpClientFactory.CreateClient("EstoqueApi");

        // 1. Validar disponibilidade de estoque de todos os produtos antes do débito
        foreach (var item in nota.Produtos)
        {
            var produto = await httpClient.GetFromJsonAsync<ProdutoEstoqueDto>($"/api/produtos/{item.ProdutoId}");
            if (produto is null)
            {
                throw new InvalidOperationException($"Produto com Id {item.ProdutoId} não encontrado no Estoque.");
            }

            if (produto.QuantidadeEstoque < item.Quantidade)
            {
                throw new InvalidOperationException($"Saldo insuficiente para o produto '{produto.Descricao}' (Id: {produto.Id}). Saldo disponível: {produto.QuantidadeEstoque}, Solicitado: {item.Quantidade}.");
            }
        }

        // 2. Debitar o saldo de cada produto no serviço de estoque
        foreach (var item in nota.Produtos)
        {
            var response = await httpClient.PostAsJsonAsync($"/api/produtos/{item.ProdutoId}/debitar-estoque", new { Quantidade = item.Quantidade });
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new InvalidOperationException($"Erro ao debitar estoque do produto {item.ProdutoId}: {error}");
            }
        }

        // 3. Atualiza o status da nota para Fechada
        nota.Status = StatusNotaFiscal.Fechada;
        await _faturamentoDbContext.SaveChangesAsync();
        return nota;
    }

    //Excluir Nota
    public async Task<bool> DeletarNota(int id)
    {
        var existeNota = await _faturamentoDbContext.NotasFiscais.FindAsync(id);
        if (existeNota is null)
        {
            return false;
        }

        _faturamentoDbContext.NotasFiscais.Remove(existeNota);
        await _faturamentoDbContext.SaveChangesAsync();
        return true;
    }
}