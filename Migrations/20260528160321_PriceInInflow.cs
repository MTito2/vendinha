using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vendinha.Migrations
{
    /// <inheritdoc />
    public partial class PriceInInflow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Inflows_Places_PlaceId",
                table: "Inflows");

            migrationBuilder.DropForeignKey(
                name: "FK_Outflows_Places_PlaceId",
                table: "Outflows");

            migrationBuilder.AlterColumn<int>(
                name: "PlaceId",
                table: "Outflows",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "PlaceId",
                table: "Inflows",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<decimal>(
                name: "UnitPrice",
                table: "Inflows",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddForeignKey(
                name: "FK_Inflows_Places_PlaceId",
                table: "Inflows",
                column: "PlaceId",
                principalTable: "Places",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Outflows_Places_PlaceId",
                table: "Outflows",
                column: "PlaceId",
                principalTable: "Places",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Inflows_Places_PlaceId",
                table: "Inflows");

            migrationBuilder.DropForeignKey(
                name: "FK_Outflows_Places_PlaceId",
                table: "Outflows");

            migrationBuilder.DropColumn(
                name: "UnitPrice",
                table: "Inflows");

            migrationBuilder.AlterColumn<int>(
                name: "PlaceId",
                table: "Outflows",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "PlaceId",
                table: "Inflows",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Inflows_Places_PlaceId",
                table: "Inflows",
                column: "PlaceId",
                principalTable: "Places",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Outflows_Places_PlaceId",
                table: "Outflows",
                column: "PlaceId",
                principalTable: "Places",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
