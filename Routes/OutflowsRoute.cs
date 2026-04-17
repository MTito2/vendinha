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
                var outflows = await context.Outflows
                    .Include(s => s.Product).ToListAsync();

                return Results.Ok(outflows);
            });
        }
    }
}