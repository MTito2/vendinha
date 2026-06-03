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
                // =========================================================================
                // 1. O RELÓGIO VEM PRIMEIRO: VERIFICA SE JÁ É HORA DE RODAR
                // =========================================================================
                DateTime agoraUtc = DateTime.UtcNow;
                DateTime proximaExecucaoUtc = new DateTime(agoraUtc.Year, agoraUtc.Month, agoraUtc.Day, 10, 0, 0, DateTimeKind.Utc); // 10:00 UTC = 07:00 Brasília

                // Se o horário de hoje já passou, calcula para amanhã
                if (agoraUtc >= proximaExecucaoUtc)
                {
                    proximaExecucaoUtc = proximaExecucaoUtc.AddDays(1);
                }

                TimeSpan tempoDeEspera = proximaExecucaoUtc - agoraUtc;

                // SE FALTA MUITO TEMPO (Mais de 1 minuto), SIGNIFICA QUE O SERVIDOR ACABOU DE LIGAR FORA DO HORÁRIO.
                // Tolerância de 1 minuto caso o servidor ligue exatamente em cima da hora marcada.
                if (tempoDeEspera.TotalMinutes > 1 && tempoDeEspera.TotalDays < 0.99)
                {
                    _logger.LogInformation($"[Agendamento] Servidor inicializado. Aguardando horário correto.");
                    _logger.LogInformation($"[Agendamento] O robô vai dormir por: {tempoDeEspera.Hours}h {tempoDeEspera.Minutes}min antes de verificar o estoque.");

                    // Faz o robô dormir primeiro e pula o envio de agora
                    await Task.Delay(tempoDeEspera, stoppingToken);
                    continue; // Volta para o início do while após acordar
                }

                // =========================================================================
                // 2. PROCESSO DE ENVIO (SÓ EXECUTA SE PASSOU PELA VERIFICAÇÃO ACIMA)
                // =========================================================================
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
                                var itensHtml = string.Join("", LowStocks.Select(e =>
                                    $"<li><b>{e.Product?.Name}</b>: Restam {e.CurrentQuantity} unidades (Local: {e.Place?.Name})</li>"));

                                var caminhoTemplate = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "StockAlert.html");
                                string templateHtml = await File.ReadAllTextAsync(caminhoTemplate, stoppingToken);
                                templateHtml = templateHtml.Replace("{{ProductList}}", itensHtml);

                                var apiKey = configuration["EmailSettings:ApiKey"] ?? "";
                                var remetente = configuration["EmailSettings:SenderEmail"] ?? "vendinha.solidaria@gmail.com";

                                var listaDestinatarios = emailsAdministradores
                                    .Where(email => !string.IsNullOrEmpty(email))
                                    .Select(email => new { email = email })
                                    .ToList();

                                var dadosEmail = new
                                {
                                    sender = new { email = remetente, name = "Vendinha" },
                                    to = listaDestinatarios,
                                    subject = "Relatório de Estoque Crítico - Vendinha",
                                    htmlContent = templateHtml
                                };

                                var jsonPayload = JsonSerializer.Serialize(dadosEmail);

                                var request = new HttpRequestMessage(HttpMethod.Post, "https://api.brevo.com/v3/smtp/email");
                                request.Headers.Add("api-key", apiKey);
                                request.Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

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

                // =========================================================================
                // 3. APÓS ENVIAR, SE ATUALIZA PARA ESPERAR ATÉ O DIA SEGUINTE
                // =========================================================================
                agoraUtc = DateTime.UtcNow;
                proximaExecucaoUtc = new DateTime(agoraUtc.Year, agoraUtc.Month, agoraUtc.Day, 10, 0, 0, DateTimeKind.Utc).AddDays(1);
                tempoDeEspera = proximaExecucaoUtc - agoraUtc;

                _logger.LogInformation($"[Agendamento] Envio diário concluído. Próximo disparo agendado para amanhã às 07:00 (Brasília).");
                await Task.Delay(tempoDeEspera, stoppingToken);
            }
        }
    }
}