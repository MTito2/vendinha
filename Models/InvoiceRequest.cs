namespace Vendinha.Models;

public class InvoiceRequest
{
    public DateTime date { get; set; }
    public string desc { get; set; }
    public string type { get; set; }
    public decimal? value { get; set; }
    public IFormFile? invoiceFile { get; set; }
}