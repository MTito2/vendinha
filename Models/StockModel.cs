namespace Vendinha.Models
{
	public class StockModel
	{
		public int Id { get; init; }
		public int ProductId{ get; set; }
		public int PlaceId{ get; set; }
		public int CurrentQuantity { get; set; }

		public StockModel(int productId, int placeId, int currentQuantity)
		{
			ProductId = productId;
			PlaceId = placeId;
			CurrentQuantity = currentQuantity;
		}
	}
}