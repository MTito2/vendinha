using Microsoft.EntityFrameworkCore;
using Vendinha.Data;
using Vendinha.Models;

namespace Vendinha.Routes
{
    public static class OutflowsRoute
    {
        public static void OutflowsRoutes(this WebApplication app)
        {
            var route = app.MapGroup("api/outflows");
            route.MapGet("", async (VendinhaContext context) =>
            {
                var outflows = await context.Outflows.ToListAsync();
                return Results.Ok(outflows);
            });

            route.MapPost("", async (OutflowRequest req, VendinhaContext context) =>
            {
                var outflow = new OutflowModel(req.date, req.clientName, req.productId, req.quantity, req.unitValue, req.placeId);
                await context.Outflows.AddAsync(outflow);
                await context.SaveChangesAsync();   
                return Results.Ok($"Saída do produto {req.productId} para o cliente {req.clientName} registrada com sucesso");
            });
        }
    }
}
