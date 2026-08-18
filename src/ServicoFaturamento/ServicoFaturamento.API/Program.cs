using ServicoFaturamento.API.Data;
using ServicoFaturamento.API.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

// Configuração de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Injeção de dependência do serviço de faturamento
builder.Services.AddScoped<IFaturamentoService, FaturamentoService>();

var faturamentoConnectionString = builder.Configuration.GetConnectionString("FaturamentoDbConnectionString");

builder.Services.AddDbContext<FaturamentoDbContext>(options => options.UseMySql(
    faturamentoConnectionString, 
    ServerVersion.AutoDetect(faturamentoConnectionString)
    ));

builder.Services.AddHttpClient("EstoqueApi", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["ServicosExternos:EstoqueApiUrl"]!);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
