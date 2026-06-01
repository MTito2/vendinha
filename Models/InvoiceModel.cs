namespace Vendinha.Models
{
    public class InvoiceModel
    {
        public int Id { get; init; }
        public string Pdf { get; set; }
        public string Type { get; set; }
        public decimal Value { get; set; }
    }
}