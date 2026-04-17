using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vendinha.Migrations
{
    /// <inheritdoc />
    public partial class EditIdProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Outflows_Products_ProductId",
                table: "Outflows");

            migrationBuilder.DropIndex(
                name: "IX_Outflows_ProductId",
                table: "Outflows");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Products",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "TEXT")
                .Annotation("Sqlite:Autoincrement", true);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "Products",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

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
    }
}
