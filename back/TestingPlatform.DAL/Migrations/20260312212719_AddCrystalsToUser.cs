using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TestingPlatform.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddCrystalsToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Crystals",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Crystals",
                table: "Users");
        }
    }
}
