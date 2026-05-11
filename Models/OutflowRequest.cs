namespace Vendinha.Models;

public record OutflowRequest(DateTime date, string clientName, int productId, int quantity, int placeId);