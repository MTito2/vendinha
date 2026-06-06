namespace Vendinha.Models;

public record UpdateUserRequest(string? Email, string? Username, string? Password, bool? IsAdmin);
