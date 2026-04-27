using Microsoft.EntityFrameworkCore;
using Vendinha.Models;

namespace Vendinha.Data
{
    public class VendinhaContext : DbContext
    {
        public DbSet<ProductModel> Products { get; set; }
        public DbSet<OutflowModel> Outflows { get; set; }
        public DbSet<InflowModel> Inflows { get; set; }
        public DbSet<PlaceModel> Places { get; set; }
        public DbSet<StockModel> Stock { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=vendinha.sqlite");
            base.OnConfiguring(optionsBuilder);
        }
    }
}