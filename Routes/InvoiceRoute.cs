using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Mvc;
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

            route.MapGet("", async (VendinhaContext context) =>
            {
                var invoices = await context.Invoices.ToListAsync();
                return Results.Ok(invoices);
            });

            route.MapPost("", async (InvoiceRequest request, VendinhaContext context) =>
            {

                if (DateTime.MinValue.Equals(request.date) ||
                    string.IsNullOrWhiteSpace(request.desc) ||
                    string.IsNullOrWhiteSpace(request.type) ||
                    !request.value.HasValue)
                {
                    return Results.BadRequest(new { message = "Os campos Pdf, Type e Value são obrigatórios." });
                }

                var newInvoice = new InvoiceModel
                {
                    Desc = request.desc,
                    Type = request.type,
                    Value = request.value.Value,
                    Date = request.date
                };

                context.Invoices.Add(newInvoice);
                await context.SaveChangesAsync();

                return Results.Created($"/api/invoices/{newInvoice.Id}", newInvoice);
            });

            route.MapPost("/{id:int}/pdf", async (IFormFile file, int id, VendinhaContext context, Cloudinary cloudinary) =>
            {
                var invoice = await context.Invoices.FindAsync(id);

                if (invoice == null)
                {
                    return Results.NotFound(new { message = "Nota não encontrada." });
                }

                if (file == null || file.Length == 0)
                {
                    return Results.BadRequest(new { message = "Nenhum arquivo PDF enviado." });
                }

                using var stream = file.OpenReadStream();

                var uploadParams = new RawUploadParams()
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "vendinha_solidaria/notas" 
                };

                var uploadResult = await cloudinary.UploadAsync(uploadParams);

                if (uploadResult.Error != null)
                {
                    return Results.BadRequest(new { message = $"Erro ao salvar o PDF na nuvem: {uploadResult.Error.Message}" });
                }

                invoice.UrlPdf = uploadResult.SecureUrl.ToString();

                await context.SaveChangesAsync();

                return Results.Ok(invoice);

            }).DisableAntiforgery();

            route.MapPut("/{id:int}", async (
                int id,
                [FromForm] InvoiceRequest request, // <-- Tudo virá daqui de dentro agora
                VendinhaContext context,
                Cloudinary cloudinary) =>
                        {
                            var invoice = await context.Invoices.FindAsync(id);

                            if (invoice == null)
                                return Results.NotFound(new { message = "Nota não encontrada." });

                            if (string.IsNullOrWhiteSpace(request.desc) || string.IsNullOrWhiteSpace(request.type) || !request.value.HasValue)
                                return Results.BadRequest(new { message = "Descrição, Tipo e Valor são obrigatórios." });

                            invoice.Date = DateTime.SpecifyKind(request.date, DateTimeKind.Utc);
                            invoice.Desc = request.desc;
                            invoice.Type = request.type;
                            invoice.Value = request.value.Value;

                            // Mudança aqui: acessa através de request.invoiceFile
                            if (request.invoiceFile != null && request.invoiceFile.Length > 0)
                            {
                                using var stream = request.invoiceFile.OpenReadStream();
                                var uploadParams = new RawUploadParams()
                                {
                                    File = new FileDescription(request.invoiceFile.FileName, stream),
                                    Folder = "vendinha_solidaria/notas"
                                };

                                var uploadResult = await cloudinary.UploadAsync(uploadParams);

                                if (uploadResult.Error != null)
                                    return Results.BadRequest(new { message = $"Erro ao salvar o novo PDF na nuvem: {uploadResult.Error.Message}" });

                                invoice.UrlPdf = uploadResult.SecureUrl.ToString();
                            }
                            await context.SaveChangesAsync();

                            return Results.Ok(invoice);

                        }).DisableAntiforgery();

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