using Microsoft.EntityFrameworkCore;
using Vendinha.Data;
using Vendinha.Models;

namespace Vendinha.Routes
{
    public static class ProductRoute
    {
        public static void ProductRoutes(this WebApplication app)
        {
            var route = app.MapGroup("api/products");

            route.MapGet("", async (VendinhaContext context) =>
            {
                var products = await context.Products.ToListAsync();
  
                return Results.Ok(products);

            });

            route.MapPost("", async (ProductRequest req, VendinhaContext context) =>
            {
                var product = new ProductModel(req.name, req.price, req.img);
                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();   

                return Results.Ok($"Produto {req.name} adicionado com sucesso");
            });

            route.MapPut("{id:guid}",
                
                async (int id, ProductRequest req, VendinhaContext context) =>
            {
                var product = await context.Products.FirstOrDefaultAsync(x => x.Id == id);

                if (product == null)
                {
                    return Results.NotFound(); 
                }

                product.ChangeName(req.name);
                product.ChangePrice(req.price);
                product.ChangeImg(req.img);

                await context.SaveChangesAsync();

                return Results.Ok(product);
            });

            route.MapDelete("{id:int}", async (int id, VendinhaContext context) =>
            {
                var product = await context.Products.FirstOrDefaultAsync(x => x.Id == id);
                
                if (product == null)
                {
                    return Results.NotFound();
                }

                context.Products.Remove(product);
                await context.SaveChangesAsync();
                return Results.NoContent();

            });
        }
    }
}
