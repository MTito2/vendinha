namespace Vendinha.Models;

public record InflowRequest(DateTime date, int productId, string? productName, float price, int quantity, int placeId);