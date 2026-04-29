namespace Vendinha.Models
{
	public class StockModel
	{
		public int Id { get; init; }
        public int PlaceId{ get; set; }
		public int CurrentQuantity { get; set; } = 0;
		public int? ProductId { get; init; }
        public ProductModel? Product { get; set; }

		public void SumStock(int currentToadd)
		{
			CurrentQuantity += currentToadd;
		}

        public void SubStock(int currentToadd)
        {
            CurrentQuantity -= currentToadd;
        }
    }
}