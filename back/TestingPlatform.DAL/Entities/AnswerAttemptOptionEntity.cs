using System.ComponentModel.DataAnnotations;

namespace TestingPlatform.DAL.Entities
{
    public class AnswerAttemptOptionEntity
    {
        [Required]
        public string AnswerAttemptId { get; set; } = default!; 
        public AnswerAttemptEntity AnswerAttempt { get; set; } = default!; 
        [Required]
        public string AnswerOptionId { get; set; } = default!;
        public AnswerOptionEntity AnswerOption { get; set; } = default!;
    }
}
