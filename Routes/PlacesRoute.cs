using Microsoft.EntityFrameworkCore;
using Vendinha.Data;
using Vendinha.Models;

namespace Vendinha.Routes
{
    public static class PlacesRoute
    {
        public static void PlacesRoutes(this WebApplication app)
        {
            var route = app.MapGroup("api/place");

            route.MapGet("", async (VendinhaContext context) =>
            {
                var places = await context.Places.ToListAsync();

                return Results.Ok(places);

            });
 
            route.MapPost("", async (PlaceRequest req, VendinhaContext context) =>
            {
                var place = new PlaceModel(req.name);
                await context.Places.AddAsync(place);
                await context.SaveChangesAsync();

                return Results.Ok($"Local {req.name} adicionado com sucesso");
            });
        }
    }
}
