namespace Vendinha.Models;

public record UpdateProductRequest(string? name, float? price, string? img);

public record CreateProductRequest(string name, float price, string img);