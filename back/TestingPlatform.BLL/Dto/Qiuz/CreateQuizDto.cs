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
        [Required(ErrorMessage = "Код тесту має бути обо'язково"),
            MaxLength(10, ErrorMessage = "Повинно бути максимум 10 символів")]
        public required string SharedCode { get; set; } = default!;
        public int? TimeLimitSeconds { get; set; } = null;
        [Required(ErrorMessage = "Власник тесту має бути обо'язково")]
        public required string OwnerId { get; set; } = default!;
        public DateTime ReleaseDate { get; internal set; }
    }
}
