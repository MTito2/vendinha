using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Vendinha.Models;

namespace Vendinha.Data
{
    public class VendinhaContext : IdentityDbContext<IdentityUser>
    {
        public VendinhaContext(DbContextOptions<VendinhaContext> options) : base(options)
        {
        }
        public DbSet<ProductModel> Products { get; set; }
        public DbSet<OutflowModel> Outflows { get; set; }
        public DbSet<InflowModel> Inflows { get; set; }
        public DbSet<PlaceModel> Places { get; set; }
        public DbSet<StockModel> Stock { get; set; }
        public DbSet<InvoiceModel> Invoices { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<PlaceModel>().HasQueryFilter(p => !p.IsDeleted);
        }
    }
}