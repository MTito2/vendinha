namespace Vendinha.Models
{
    public class OutflowModel
    {
        public Guid Id { get; init; }
        public DateTime Date { get; set; }
        public string ClientName { get; set; }
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
        public float UnitValue { get; set; }
        public Guid PlaceId { get; set; }

        public OutflowModel(DateTime date, string clientName, Guid productId, int quantity, float unitValue, Guid placeId)
        {
            Id = Guid.NewGuid();
            Date = date;
            ClientName = clientName;
            ProductId = productId;
            Quantity = quantity;
            UnitValue = unitValue;
            PlaceId = placeId;
        }
    }
}