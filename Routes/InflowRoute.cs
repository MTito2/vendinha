using Microsoft.EntityFrameworkCore;
using Vendinha.Data;
using Vendinha.Models;

namespace Vendinha.Routes
{
    public static class InflowsRoute
    {
        public static void InflowsRoutes(this WebApplication app)
        {
            var route = app.MapGroup("api/inflows").RequireAuthorization();

            route.MapGet("", async (VendinhaContext context, int? month, int? year) =>
            {
                var query = context.Inflows
                .Include(t => t.Place)
                .IgnoreQueryFilters()
                .Include(t => t.Product)
                .AsQueryable();

                if (month.HasValue && year.HasValue)
                {
                    var startDate = DateTime.SpecifyKind(
                        new DateTime(year.Value, month.Value, 1),
                        DateTimeKind.Utc);
                    var endDate = startDate.AddMonths(1).AddTicks(-1);

                    query = query.Where(t => t.Date >= startDate && t.Date <= endDate);
                }
                else if (month.HasValue || year.HasValue)
                {
                    return Results.BadRequest(new
                    {
                        erro = "Filtro inválido. O mês e o ano devem ser informados juntos."
                    });
                }

                var inflows = await query.ToListAsync();
                return Results.Ok(inflows);
            });

            route.MapGet("place/{place:int}", async (int place, VendinhaContext context) =>
            {
                var inflows = await context.Inflows.Where(x => x.PlaceId == place)
                    .Include(s => s.Product).ToListAsync();

                return Results.Ok(inflows);
            });

            route.MapPost("", async (InflowRequest req, VendinhaContext context) =>
            {
                if (string.IsNullOrWhiteSpace(req.productName))
                {
                    return Results.BadRequest(new { erro = "Nome do produto é obrigatório." });
                }

                // 1. Busca o produto verificando o NOME e o PREÇO exatos
                var product = await context.Products
                    .FirstOrDefaultAsync(p => p.Name == req.productName && p.Price == req.price);

                // 2. Se não existir um produto com esse nome E esse preço, cria um novo
                if (product == null)
                {
                    // Mantive a sua versão com a imagem!
                    product = new ProductModel(req.productName, req.price, "https://res.cloudinary.com/dcvzrr7co/image/upload/v1779973622/vendinha_solidaria/ukgtl2tjophp8p5gngkj.jpg");
                    await context.Products.AddAsync(product);
                }

                // 3. Gerencia o Estoque (MÁGICA DA UNIFICAÇÃO AQUI)
                // Em vez de buscar pelo product.Id, buscamos se já existe um estoque 
                // de QUALQUER produto que tenha o mesmo NOME no mesmo local.
                var stockExisting = await context.Stock
                    .Include(x => x.Product) // Traz os dados do Produto junto para podermos ler o Nome
                    .FirstOrDefaultAsync(x => x.Product.Name == req.productName && x.PlaceId == req.placeId);

                if (stockExisting != null)
                {
                    // Se já existe um estoque para "Chocolate" (mesmo que de outro ID/Preço antigo), 
                    // apenas soma a quantidade nele. O estoque fica unificado!
                    stockExisting.SumStock(req.quantity);
                }
                else
                {
                    // Se é a PRIMEIRA vez na história que entra um "Chocolate" neste local, cria o estoque do zero
                    var newStock = new StockModel
                    {
                        PlaceId = req.placeId,
                        CurrentQuantity = req.quantity,
                        Product = product
                    };
                    await context.Stock.AddAsync(newStock);
                }

                // 4. Registra a Entrada no Histórico
                // A entrada (Inflow) continua apontando para o Produto exato daquele dia, protegendo o seu financeiro!
                var inflow = new InflowModel
                {
                    Date = req.date,
                    Quantity = req.quantity,
                    PlaceId = req.placeId,
                    Product = product,
                };

                await context.Inflows.AddAsync(inflow);

                // 5. Salva tudo no banco
                await context.SaveChangesAsync();

                return Results.Ok(new { mensagem = "Entrada registrada e estoque unificado com sucesso!" });
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