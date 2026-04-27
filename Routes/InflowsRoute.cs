using Microsoft.EntityFrameworkCore;
using Vendinha.Data;
using Vendinha.Models;

namespace Vendinha.Routes
{
    public static class InflowsRoute
    {
        public static void InflowsRoutes(this WebApplication app)
        {
            var route = app.MapGroup("api/inflows");
            route.MapGet("place/{place:int}", async (int place, VendinhaContext context) =>
            {
                var inflows = await context.Inflows.Where(x => x.PlaceId == place)
                    .Include(s => s.Product).ToListAsync();

                return Results.Ok(inflows);
            });

            route.MapPost("", async (InflowRequest req, VendinhaContext context) =>
            {
                InflowModel inflow;

                if (req.productId == 0)
                {
                    var newProduct = new ProductModel(req.productName, req.price, null);

                    inflow = new InflowModel
                    {
                        Date = req.date,
                        Product = newProduct,
                        Quantity = req.quantity,
                        PlaceId = req.placeId
                    };
                }

                else
                {
                    inflow = new InflowModel
                    {
                        Date = req.date,
                        ProductId = req.productId,
                        Quantity = req.quantity,
                        PlaceId = req.placeId
                    };
                }

                await context.Inflows.AddAsync(inflow);
                await context.SaveChangesAsync();

                return Results.Ok();
            });

            route.MapDelete("{id:int}", async (int id, VendinhaContext context) =>
            {
                var inflow = await context.Inflows.FirstOrDefaultAsync(x => x.Id == id);
                if (inflow == null)

                {
                    return Results.NotFound();
                }

                context.Inflows.Remove(inflow);
                await context.SaveChangesAsync();
                return Results.NoContent();
            });
        }

    }
}