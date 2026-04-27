namespace Vendinha.Models
{
    public class ProductModel
    {
        public int Id { get; init; }
        public string Name { get; set; }
        public float Price { get; set; }
        public string? Img { get; set; }
        public bool Active { get; set; } = true;

        public ProductModel(string name, float price, string? img)
        {
            Name = name;
            Price = price;
            Img = img;
        }

        public void ChangeName(string name)
        {
            Name = name;
        }

        public void ChangeImg(string? img)
        {
            Img = img;
        }

        public void ChangePrice(float price)
        {
            Price = price;
        }
    }
}
