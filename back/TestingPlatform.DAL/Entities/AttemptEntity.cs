using System.ComponentModel.DataAnnotations;

namespace TestingPlatform.DAL.Entities
{
    public enum Status {
        inProgress = 0,
        Submitted = 1,
        Expired = 2
    }

    public class AttemptEntity : BaseEntity
    {
        public int MaxScore { get; set; }
        public int? Score {  get; set; }
        public int? Percentage { get; set; }
        public int? DurationSeconds { get; set; }

        public DateTime? FinishedAt { get; set; }
        public Status Status {  get; set; }

        [Required]
        public string QuizId { get; set; } = default!;
        public QuizEntity Quiz { get; set; } = default!;

        [Required]
        public string UserId { get; set; } = default!;
        public UserEntity User { get; set; } = default!;

        public virtual ICollection<AnswerAttemptEntity> AnswerAttempts { get; set; } = [];
    }
}
