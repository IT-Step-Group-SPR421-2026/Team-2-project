using System.ComponentModel.DataAnnotations;

namespace TestingPlatform.DAL.Entities
{
    public class AnswerAttemptEntity : BaseEntity
    {
        public string? TextAnswer { get; set; }
        public bool isCorrect { get; set; }
        public int EarnedPoints { get; set; }

        [Required]
        public string AttemptId { get; set; } = default!;
        public AttemptEntity Attempt { get; set; } = default!;

        [Required]
        public string QuestionId { get; set; } = default!; 
        public QuestionEntity Question { get; set; } = default!;

        public virtual ICollection<AnswerOptionEntity> AnswerOptions { get; set; } = [];
    }
}
