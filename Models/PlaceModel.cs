namespace Vendinha.Models
{
    public class PlaceModel
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Acronym { get; set; }
        public bool IsDeleted { get; set; } = false;

        public PlaceModel(string name, string acronym)
        {
            Name = name;
            Acronym = acronym;
        }
    }
}