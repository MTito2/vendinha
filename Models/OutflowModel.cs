namespace Vendinha.Models
{
    public class OutflowModel
    {
        public int Id { get; init; }
        public DateTime Date { get; set; }
        public string ClientName { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public int PlaceId { get; set; }

        public ProductModel? Product { get; set; }
    
        public OutflowModel(DateTime date, string clientName, int productId, int quantity, int placeId)
        {
            Date = date;
            ClientName = clientName;
            ProductId = productId;
            Quantity = quantity;
            PlaceId = placeId;
        }
    }
}