using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vendinha.Migrations
{
    /// <inheritdoc />
    public partial class EditIdOutflow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Outflows_Products_ProductId1",
                table: "Outflows");

            migrationBuilder.DropIndex(
                name: "IX_Outflows_ProductId1",
                table: "Outflows");

            migrationBuilder.DropColumn(
                name: "ProductId1",
                table: "Outflows");

            migrationBuilder.AlterColumn<int>(
                name: "ProductId",
                table: "Outflows",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<int>(
                name: "PlaceId",
                table: "Outflows",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Outflows",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "TEXT")
                .Annotation("Sqlite:Autoincrement", true);

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

            migrationBuilder.AlterColumn<Guid>(
                name: "ProductId",
                table: "Outflows",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AlterColumn<Guid>(
                name: "PlaceId",
                table: "Outflows",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "Outflows",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddColumn<int>(
                name: "ProductId1",
                table: "Outflows",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Outflows_ProductId1",
                table: "Outflows",
                column: "ProductId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Outflows_Products_ProductId1",
                table: "Outflows",
                column: "ProductId1",
                principalTable: "Products",
                principalColumn: "Id");
        }
    }
}
