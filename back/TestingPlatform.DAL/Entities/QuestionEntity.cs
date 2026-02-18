using System.ComponentModel.DataAnnotations;

namespace TestingPlatform.DAL.Entities
{
    public class QuestionEntity : BaseEntity
    {
        [Required]
        public string Text { get; set; } = default!; 

        public int OrderIndex { get; set; }

        [Required]
        public QuizEntity Quiz { get; set; } = default!; 
        public string QuizId { get; set; } = default!;

        public virtual ICollection<AnswerOptionEntity> AnswerOptions { get; set; } = [];
        public virtual ICollection<AnswerAttemptEntity> AnswerAttempts{ get; set; } = [];
    }
}
