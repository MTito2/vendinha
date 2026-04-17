using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vendinha.Migrations
{
    /// <inheritdoc />
    public partial class EditOutflowTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Outflows");

            migrationBuilder.CreateIndex(
                name: "IX_Outflows_ProductId",
                table: "Outflows",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_Outflows_Products_ProductId",
                table: "Outflows",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Outflows_Products_ProductId",
                table: "Outflows");

            migrationBuilder.DropIndex(
                name: "IX_Outflows_ProductId",
                table: "Outflows");

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "Outflows",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }
    }
}
