namespace Vendinha.Models
{
    public class PlaceModel
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Acronym { get; set; }

        public PlaceModel() { }

        public PlaceModel(string name, string acronym)
        {
            Name = name;
            Acronym = acronym;
        }
    }
}