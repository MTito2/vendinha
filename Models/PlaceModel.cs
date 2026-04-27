namespace Vendinha.Models
{
    public class PlaceModel
    {
        public int Id { get; init; }
        public string Name { get; set; }

        public PlaceModel(string name)
        {
            Name = name;
        }
    }
}