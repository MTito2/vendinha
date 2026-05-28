using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
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

            route.MapPost("", async (CreateProductRequest req, VendinhaContext context) =>
            {
                var product = new ProductModel(req.name, req.price, req.img);
                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();   

                return Results.Ok($"Produto {req.name} adicionado com sucesso");
            });

            route.MapPut("{id:int}",
                
                async (int id, UpdateProductRequest req, VendinhaContext context) =>
            {
                var product = await context.Products.FirstOrDefaultAsync(x => x.Id == id);

                if (product == null)
                {
                    return Results.NotFound(); 
                }

                if (string.IsNullOrEmpty(req.name) || req.price == null || string.IsNullOrEmpty(req.img))
                {
                    return Results.BadRequest("Todos os campos são obrigatórios para atualização completa.");
                }

                product.ChangeName(req.name);
                product.ChangePrice(req.price.Value);
                product.ChangeImg(req.img);

                if (req.active != null)
                {
                    product.Active = req.active.Value;
                }

                await context.SaveChangesAsync();

                return Results.Ok(product);
            });

            route.MapPatch("{id:int}",
                
                async (int id, UpdateProductRequest req, VendinhaContext context) =>
            {
                var product = await context.Products.FirstOrDefaultAsync(x => x.Id == id);
                if (product == null)
                {
                    return Results.NotFound(); 
                }
                if (!string.IsNullOrEmpty(req.name))
                {
                    product.ChangeName(req.name);
                }
                if (req.price != null)
                {
                    product.ChangePrice(req.price.Value);
                }
                if (!string.IsNullOrEmpty(req.img))
                {
                    product.ChangeImg(req.img);
                }

                if (req.active != null)
                {
                    product.Active = req.active.Value;
                    ;
                }
                await context.SaveChangesAsync();
                return Results.Ok(product);
            });

            route.MapPost("{id:int}", async (IFormFile file, int id, VendinhaContext context, Cloudinary cloudinary) =>
            {
                var product = await context.Products.FirstOrDefaultAsync(x => x.Id == id);
                if (product == null)
                {
                    return Results.NotFound();
                }

                if (file == null || file.Length == 0)
                {
                    return Results.BadRequest("Nenhuma imagem enviada.");
                }

                using var stream = file.OpenReadStream();

                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "vendinha_solidaria" 
                };

                var uploadResult = await cloudinary.UploadAsync(uploadParams);

                if (uploadResult.Error != null)
                {
                    return Results.BadRequest($"Erro ao salvar na nuvem: {uploadResult.Error.Message}");
                }

                product.ChangeImg(uploadResult.SecureUrl.ToString());

                await context.SaveChangesAsync();

                return Results.Ok(product);

            }).DisableAntiforgery();

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
