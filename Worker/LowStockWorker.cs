using FluentEmail.Core;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Vendinha.Data;

namespace Vendinha.Workers
{
    public class LowStockWorker : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<LowStockWorker> _logger;

        public LowStockWorker(IServiceScopeFactory scopeFactory, ILogger<LowStockWorker> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Serviço de monitoramento de estoque iniciado.");

            while (!stoppingToken.IsCancellationRequested)
            {

                try
                {
                    using (var scope = _scopeFactory.CreateScope())
                    {
                        var context = scope.ServiceProvider.GetRequiredService<VendinhaContext>();
                        var emailService = scope.ServiceProvider.GetRequiredService<IFluentEmail>();
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
                                    $"<li><b>{e.Product?.Name}</b>: Restam {e.CurrentQuantity} unidades (Local: {e.Place.Name})</li>"));


                                var caminhoTemplate = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "StockAlert.html");
                                string templateHtml = await File.ReadAllTextAsync(caminhoTemplate, stoppingToken);

                                templateHtml = templateHtml.Replace("{{ProductList}}", itensHtml);

                                foreach (var adminEmail in emailsAdministradores)
                                {
                                    if (!string.IsNullOrEmpty(adminEmail))
                                    {
                                        await emailService
                                            .SetFrom("vendinha.solidaria@gmail.com")
                                            .To(adminEmail)
                                            .Subject("Relatório de Estoque Crítico - Vendinha")
                                            .Body(templateHtml, isHtml: true)
                                            .SendAsync();
                                    }
                                }

                                _logger.LogInformation($"Alerta enviado com sucesso para {emailsAdministradores.Count} administradores!");
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    // 1. Loga a mensagem genérica
                    _logger.LogError($"Erro ao verificar estoque: {ex.Message}");

                    // 2. Procura pela causa raiz (InnerException) e loga se existir
                    if (ex.InnerException != null)
                    {
                        _logger.LogError($"CAUSA RAIZ (InnerException): {ex.InnerException.Message}");
                    }

                    // 3. Imprime o erro técnico completo no terminal do Render para análise
                    _logger.LogError(ex, "Detalhes técnicos completos do erro:");
                }


                var now = DateTime.Now;
                var nextExecution = new DateTime(now.Year, now.Month, now.Day, 12, 48, 0);

                if (now >= nextExecution)
                {
                    nextExecution = nextExecution.AddDays(1);
                }

                var waitTime = nextExecution - now;

                _logger.LogInformation($"Próxima verificação de estoque agendada para: {nextExecution}");

                await Task.Delay(waitTime, stoppingToken);
                //await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);

            }
        }
    }
}