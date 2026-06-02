using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vendinha.Migrations
{
    /// <inheritdoc />
    public partial class AddColumnDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Pdf",
                table: "Invoices",
                newName: "UrlPdf");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Invoices",
                newName: "Desc");

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "Invoices",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "Invoices");

            migrationBuilder.RenameColumn(
                name: "UrlPdf",
                table: "Invoices",
                newName: "Pdf");

            migrationBuilder.RenameColumn(
                name: "Desc",
                table: "Invoices",
                newName: "Name");
        }
    }
}
