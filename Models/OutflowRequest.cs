namespace Vendinha.Models;

public record OutflowRequest(DateTime date, string clientName, int productId, float totalPrice, int quantity, int placeId);