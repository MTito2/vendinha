using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Text;
using System.Text.Json;
using Vendinha.Data;

namespace Vendinha.Workers
{
    public class LowStockWorker : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<LowStockWorker> _logger;
        private static readonly HttpClient _httpClient = new HttpClient(); // Cliente web simples

        public LowStockWorker(IServiceScopeFactory scopeFactory, ILogger<LowStockWorker> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Serviço de monitoramento de estoque iniciado via HTTP Puro.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _scopeFactory.CreateScope())
                    {
                        var context = scope.ServiceProvider.GetRequiredService<VendinhaContext>();
                        var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
                        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();

                        _logger.LogInformation("Verificando produtos com estoque baixo...");
                        var LowStocks = await context.Stock
                            .Include(s => s.Product)
                            .Include(s => s.Place)
                            .Where(s => s.CurrentQuantity < 5)
                            .ToListAsync(stoppingToken);

                        if (LowStocks.Any())
                        {
                            var emailsAdministradores = await userManager.Users
                                .Select(u => u.Email)
                                .ToListAsync(stoppingToken);

                            if (emailsAdministradores.Any())
                            {
                                // Monta a lista de produtos em HTML
                                var itensHtml = string.Join("", LowStocks.Select(e =>
                                    $"<li><b>{e.Product?.Name}</b>: Restam {e.CurrentQuantity} unidades (Local: {e.Place?.Name})</li>"));

                                var caminhoTemplate = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "StockAlert.html");
                                string templateHtml = await File.ReadAllTextAsync(caminhoTemplate, stoppingToken);
                                templateHtml = templateHtml.Replace("{{ProductList}}", itensHtml);

                                // Pega as configurações do Brevo
                                var apiKey = configuration["EmailSettings:ApiKey"] ?? "";
                                var remetente = configuration["EmailSettings:SenderEmail"] ?? "vendinha.solidaria@gmail.com";

                                // Prepara a lista de destinatários no formato que o Brevo exige
                                var listaDestinatarios = emailsAdministradores
                                    .Where(email => !string.IsNullOrEmpty(email))
                                    .Select(email => new { email = email })
                                    .ToList();

                                // Monta o JSON (o pacotinho de dados) para mandar pro Brevo
                                var dadosEmail = new
                                {
                                    sender = new { email = remetente, name = "Vendinha" },
                                    to = listaDestinatarios,
                                    subject = "Relatório de Estoque Crítico - Vendinha",
                                    htmlContent = templateHtml
                                };

                                var jsonPayload = JsonSerializer.Serialize(dadosEmail);

                                // Prepara a requisição HTTP (Simula um navegador acessando o site do Brevo)
                                var request = new HttpRequestMessage(HttpMethod.Post, "https://api.brevo.com/v3/smtp/email");
                                request.Headers.Add("api-key", apiKey);
                                request.Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                                // Envia de verdade
                                var response = await _httpClient.SendAsync(request, stoppingToken);

                                if (response.IsSuccessStatusCode)
                                {
                                    _logger.LogInformation($"Alerta enviado com sucesso via HTTP para {listaDestinatarios.Count} administradores!");
                                }
                                else
                                {
                                    var erroDetalhado = await response.Content.ReadAsStringAsync(stoppingToken);
                                    _logger.LogError($"Falha no Brevo: {response.StatusCode} - {erroDetalhado}");
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Erro ao verificar estoque: {ex.Message}");
                }

                // Mantém os seus 30 segundos para você ver o teste rodar na hora!
                _logger.LogInformation("Aguardando 30 segundos para o próximo teste...");
                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
            }
        }
    }
}