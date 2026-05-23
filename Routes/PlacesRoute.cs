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
                var place = new PlaceModel(req.name, req.acronym);
                await context.Places.AddAsync(place);
                await context.SaveChangesAsync();

                return Results.Ok($"Local {req.name} adicionado com sucesso");
            });

            route.MapDelete("{id:int}", async (int id, VendinhaContext context) =>
            {
                var place = await context.Places.FirstOrDefaultAsync(x => x.Id == id);
                if (place == null)
                {
                    return Results.NotFound();
                }

                context.Places.Remove(place);
                await context.SaveChangesAsync();
                return Results.NoContent();
            });

            route.MapPut("{id:int}",

             async (int id, PlaceRequest req, VendinhaContext context) =>
             {
                 var place = await context.Places.FirstOrDefaultAsync(x => x.Id == id);

                 if (place == null)
                 {
                     return Results.NotFound();
                 }

                 if (string.IsNullOrEmpty(req.name) || req.acronym == null)
                 {
                     return Results.BadRequest("Todos os campos são obrigatórios para atualização completa.");
                 }

                 place.Name = req.name;
                 place.Acronym = req.acronym;

                 await context.SaveChangesAsync();

                 return Results.Ok(place);
             });

            route.MapPatch("{id:int}",

               async (int id, PlaceRequest req, VendinhaContext context) =>
               {
                   var place = await context.Places.FirstOrDefaultAsync(x => x.Id == id);
                   if (place == null)
                   {
                       return Results.NotFound();
                   }
                   if (!string.IsNullOrEmpty(req.name))
                   {
                       place.Name = req.name;
                   }
                  
                   if (req.acronym != null)
                   {
                       place.Acronym = req.acronym;
                   }
                   await context.SaveChangesAsync();
                   return Results.Ok(place);
               });
        }
    }
}
