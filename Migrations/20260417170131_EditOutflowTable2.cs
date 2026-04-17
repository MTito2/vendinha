using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vendinha.Migrations
{
    /// <inheritdoc />
    public partial class EditOutflowTable2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UnitValue",
                table: "Outflows");

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "Outflows",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Outflows");

            migrationBuilder.AddColumn<float>(
                name: "UnitValue",
                table: "Outflows",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);
        }
    }
}
