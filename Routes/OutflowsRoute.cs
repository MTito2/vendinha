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
            route.MapGet("place/{place:int}", async (int place, VendinhaContext context) =>
            {
                var outflows = await context.Outflows.Where(x => x.PlaceId == place)
                    .Include(s => s.Product).ToListAsync();

                return Results.Ok(outflows);
            });

            route.MapPost("", async (OutflowRequest req, VendinhaContext context) =>
            {
                var outflow = new OutflowModel(req.date, req.clientName, req.productId, req.totalPrice, req.quantity, req.placeId);
                var stock = await context.Stock.FirstOrDefaultAsync(x => x.PlaceId == req.placeId && x.ProductId == req.productId);
                if (stock != null)
                {
                    stock.SubStock(req.quantity);
                }

                await context.Outflows.AddAsync(outflow);
                
                await context.SaveChangesAsync();

                return Results.Ok();
            });

            route.MapDelete("{id:int}", async (int id, VendinhaContext context) =>
            {
                var outflow = await context.Outflows.FirstOrDefaultAsync(x => x.Id == id);
                if (outflow == null)
                {
                    return Results.NotFound();
                }

                context.Outflows.Remove(outflow);
                await context.SaveChangesAsync();
                return Results.NoContent();
            });
        }

    }
}