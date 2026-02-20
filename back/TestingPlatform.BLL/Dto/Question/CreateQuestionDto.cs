using System.ComponentModel.DataAnnotations;

namespace TestingPlatform.BLL.Dto.Question
{
    public class CreateQuestionDto
    {
        [Required]
        public string Text { get; set; } = default!;

        public int OrderIndex { get; set; }

        [Required]
        public string QuizId { get; set; } = default!;
    }
}
