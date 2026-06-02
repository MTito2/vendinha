namespace Vendinha.Models
{
    public class InvoiceModel
    {
        public int Id { get; init; }
        public DateTime Date { get; set; }
        public string Desc { get; set; }
        public string? UrlPdf { get; set; }
        public string Type { get; set; }
        public decimal Value { get; set; }
    }
}