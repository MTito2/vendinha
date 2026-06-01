using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
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

            // POST: Cria uma nova nota (Invoice)
            route.MapPost("", async (InvoiceRequest request, VendinhaContext context) =>
            {
                // Como é uma criação, garantimos que os dados obrigatórios foram enviados
                if (string.IsNullOrWhiteSpace(request.pdf) ||
                    string.IsNullOrWhiteSpace(request.type) ||
                    !request.value.HasValue)
                {
                    return Results.BadRequest(new { message = "Os campos Pdf, Type e Value são obrigatórios." });
                }

                // Transforma o Record (InvoiceRequest) no Modelo do Banco (InvoiceModel)
                var newInvoice = new InvoiceModel
                {
                    Pdf = request.pdf,
                    Type = request.type,
                    Value = request.value.Value
                };

                // Adiciona a entidade no contexto e salva no banco de dados
                context.Invoices.Add(newInvoice);
                await context.SaveChangesAsync();

                // Retorna 201 Created com a URL do novo recurso e o objeto criado
                return Results.Created($"/api/inflows/{newInvoice.Id}", newInvoice);
            });

            route.MapPost("/{id:int}/pdf", async (IFormFile file, int id, VendinhaContext context, Cloudinary cloudinary) =>
            {
                // 1. Busca a nota fiscal (Invoice) no banco de dados
                var invoice = await context.Invoices.FindAsync(id);

                if (invoice == null)
                {
                    return Results.NotFound(new { message = "Nota não encontrada." });
                }

                // 2. Valida se o arquivo foi enviado e se não está vazio
                if (file == null || file.Length == 0)
                {
                    return Results.BadRequest(new { message = "Nenhum arquivo PDF enviado." });
                }

                // 3. Prepara o stream do arquivo
                using var stream = file.OpenReadStream();

                // 4. Parâmetros de upload para o Cloudinary
                // ATENÇÃO: Usamos RawUploadParams para PDFs e documentos
                var uploadParams = new RawUploadParams()
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "vendinha_solidaria/notas" // Dica: pasta separada das imagens para organização
                };

                // 5. Faz o upload para o Cloudinary
                var uploadResult = await cloudinary.UploadAsync(uploadParams);

                if (uploadResult.Error != null)
                {
                    return Results.BadRequest(new { message = $"Erro ao salvar o PDF na nuvem: {uploadResult.Error.Message}" });
                }

                // 6. Atualiza a propriedade Pdf da nota com a URL segura gerada pelo Cloudinary
                invoice.Pdf = uploadResult.SecureUrl.ToString();

                // 7. Salva a alteração no banco de dados do Entity Framework
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