namespace Vendinha.Models;

public record OutflowRequest(DateTime date, string clientName, Guid productId, int quantity, Guid placeId);