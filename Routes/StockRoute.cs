using Microsoft.EntityFrameworkCore;
using Vendinha.Data;
using Vendinha.Models;

namespace Vendinha.Routes
{
    public static class StockRoute
    {
        public static void StockRoutes(this WebApplication app)
        {
            var route = app.MapGroup("api/stock");

            route.MapGet("", async (VendinhaContext context) =>
            {
                var stock = await context.Stock.ToListAsync();

                return Results.Ok(
);

            });
        }
    }
}
