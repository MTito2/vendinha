using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vendinha.Migrations
{
    /// <inheritdoc />
    public partial class RemovePriceInInflow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UnitPrice",
                table: "Inflows");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "UnitPrice",
                table: "Inflows",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
