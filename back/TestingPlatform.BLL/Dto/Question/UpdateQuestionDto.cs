using System.ComponentModel.DataAnnotations;

namespace TestingPlatform.BLL.Dto.Question
{
    public class UpdateQuestionDto
    {
        [Required]
        public string? Id { get; set; }
        [Required]
        public string Text { get; set; } = default!;

        public int OrderIndex { get; set; }

        [Required]
        public string QuizId { get; set; } = default!;
    }
}
