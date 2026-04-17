namespace Vendinha.Models;

public record OutflowRequest(DateTime date, string clientName, Guid productId, int quantity, float unitValue, Guid placeId);