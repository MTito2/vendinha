namespace Vendinha.Models;

public record UpdateProductRequest(string? name, float? price, string? img, bool active);

public record CreateProductRequest(string name, float price, string img, bool active);