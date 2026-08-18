# Teste Técnico Korp — Emissão de Notas Fiscais e Controle de Estoque
**Candidato:** Kauã Andrade

---

## Estrutura do Repositório

```
Teste_Korp_KauaAndrade/
├── Korp_Teste_KauaAndrade.slnx      # Solução .NET Backend
├── src/                             # Serviços do Backend (.NET C#)
│   ├── ServicoEstoque/              # API de Controle e Gestão de Estoque
│   └── ServicoFaturamento/          # API de Faturamento e Emissão de Notas Fiscais
└── Korp_Front/                      # Aplicação Frontend (Angular Standalone)
    ├── src/
    ├── README.md
    ├── DETALHAMENTO_TECNICO.md
    └── ROTAS_BACKEND.md
```

---

## Como Executar

### 1. Backend (.NET)
Para restaurar e compilar a solução completa:
```bash
dotnet restore Korp_Teste_KauaAndrade.slnx
dotnet build Korp_Teste_KauaAndrade.slnx
```

Para rodar os serviços individualmente:
- **Serviço de Estoque:**
  ```bash
  dotnet run --project src/ServicoEstoque/ServicoEstoque.API/ServicoEstoque.API.csproj
  ```
- **Serviço de Faturamento:**
  ```bash
  dotnet run --project src/ServicoFaturamento/ServicoFaturamento.API/ServicoFaturamento.API.csproj
  ```

---

### 2. Frontend (Angular)
Entre na pasta `Korp_Front`:
```bash
cd Korp_Front
npm install
npm start
```
Acesse [http://localhost:4200](http://localhost:4200).
