namespace Vendinha.Models
{
    public class ProductModel
    {
        public Guid Id {  get; init; }
        public string Name { get; private set; }
        public float Price { get; set; }
        public string Img { get; set; }

        public ProductModel(string name, float price, string img)
        {
            Id = Guid.NewGuid();
            Name = name;
            Price = price;
            Img = img;
        }

        public void ChangeName(string name)
        {
            Name = name;
        }

        public void ChangeImg(string img)
        {
            Img = img;
        }

        public void ChangePrice(float price)
        {
            Price = price;
        }
    }
}
