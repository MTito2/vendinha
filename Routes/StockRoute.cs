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
                var stock = await context.Stock.Include(s => s.Product).ToListAsync(); ;

                return Results.Ok(stock);

            });

            route.MapGet("place/{place:int}", async (int place,  VendinhaContext context) =>
            {
                var stock = await context.Stock.Where(x => x.PlaceId == place).Include(s => s.Product).ToListAsync(); ;

                return Results.Ok(stock);

            });

            route.MapDelete("{id:int}", async (int id, VendinhaContext context) =>
            {
                var stock = await context.Stock.FirstOrDefaultAsync(x => x.Id == id);
                if (stock == null)
                {
                    return Results.NotFound();
                }
                context.Stock.Remove(stock);
                await context.SaveChangesAsync();
                return Results.NoContent();
            });
        }
    }
}
