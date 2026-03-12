using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TestingPlatform.DAL.Migrations
{
    /// <inheritdoc />
    public partial class fav : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "dislikes",
                table: "Quizzes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "likes",
                table: "Quizzes",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "dislikes",
                table: "Quizzes");

            migrationBuilder.DropColumn(
                name: "likes",
                table: "Quizzes");
        }
    }
}
