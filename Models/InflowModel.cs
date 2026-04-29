namespace Vendinha.Models
{
    public class InflowModel
    {
        public int Id { get; init; }
        public DateTime Date { get; set; }
        public int Quantity { get; set; }
        public int PlaceId { get; set; }
        public int? ProductId { get; set; }
        public ProductModel? Product { get; set; }
    }
}