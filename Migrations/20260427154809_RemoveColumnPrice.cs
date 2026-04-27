using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vendinha.Migrations
{
    /// <inheritdoc />
    public partial class RemoveColumnPrice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "Inflows");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "Price",
                table: "Inflows",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);
        }
    }
}
