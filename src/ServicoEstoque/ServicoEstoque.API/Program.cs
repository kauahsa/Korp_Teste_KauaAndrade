using Microsoft.EntityFrameworkCore;
using ServicoEstoque.API.Data;
using ServicoEstoque.API.Services;

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

// Injeção de dependência do serviço de estoque
builder.Services.AddScoped<IEstoqueService, EstoqueService>();

//String de Conexão
var estoqueConnectionString = builder.Configuration.GetConnectionString("EstoqueDbConnectionString");

//FazendoConexão
builder.Services.AddDbContext<EstoqueDbContext>(options => options.UseSqlServer(estoqueConnectionString));

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

