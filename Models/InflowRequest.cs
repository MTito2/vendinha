namespace Vendinha.Models;

public record InvoiceRequest(string? pdf, string? type, decimal? value);