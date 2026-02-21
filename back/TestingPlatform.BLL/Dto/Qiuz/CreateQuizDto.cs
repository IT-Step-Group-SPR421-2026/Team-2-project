using System.ComponentModel.DataAnnotations;

namespace TestingPlatform.BLL.Dto.Qiuz
{
    public class CreateQuizDto
    {
        [Required(ErrorMessage = "І'мя тесту має бути обо'язково"),
           MaxLength(100, ErrorMessage = "Повинно бути максимум 100 символів")]
        public required string Title { get; set; }

        [Required(ErrorMessage = "Опис тесту має бути обо'язково")]
        public required string Description { get; set; } = default!;
        public bool isPublic { get; set; }
        public int? TimeLimitSeconds { get; set; } = null;
        [Required(ErrorMessage = "Власник тесту має бути обо'язково")]
        public required string OwnerId { get; set; } = default!;
        public DateTime ReleaseDate { get; internal set; }
    }
}
