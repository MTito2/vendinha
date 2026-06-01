using Microsoft.EntityFrameworkCore;
using Vendinha.Data;
using Vendinha.Models;

namespace Vendinha.Routes
{
    public static class InvoiceRoute
    {
        public static void InvoicesRoutes(this WebApplication app)
        {
            var route = app.MapGroup("api/invoices");

            // 1. GET: Retorna tudo, sem filtros [1]
            route.MapGet("", async (VendinhaContext context) =>
            {
                var invoices = await context.Invoices.ToListAsync();
                return Results.Ok(invoices);
            });

            // 2. PATCH: Atualiza 1 ou todos os atributos [2]
            route.MapPatch("/{id:int}", async (int id, InvoiceRequest request, VendinhaContext context) =>
            {
                // Busca a nota no banco
                var invoice = await context.Invoices.FindAsync(id);

                if (invoice == null)
                    return Results.NotFound(new { message = "Nota não encontrada." });

                // Atualiza apenas os campos que foram enviados (ignora os nulos)
                if (!string.IsNullOrWhiteSpace(request.pdf))
                    invoice.Pdf = request.pdf;

                if (!string.IsNullOrWhiteSpace(request.type))
                    invoice.Type = request.type;

                // Assumindo que Value seja Nullable (decimal?) no seu record InvoiceRequest
                if (request.value.HasValue)
                    invoice.Value = request.value.Value;

                await context.SaveChangesAsync();

                return Results.Ok(invoice);
            });


            route.MapDelete("/{id:int}", async (int id, VendinhaContext context) =>
            {
                var invoice = await context.Invoices.FindAsync(id);

                if (invoice == null)
                    return Results.NotFound(new { message = "Nota não encontrada." });


                context.Invoices.Remove(invoice);
                await context.SaveChangesAsync();

                return Results.Ok(new { message = "Nota deletada com sucesso." });
            });
        }
    }
}