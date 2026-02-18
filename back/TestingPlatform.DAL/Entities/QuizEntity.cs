using System.ComponentModel.DataAnnotations;

namespace TestingPlatform.DAL.Entities
{
    public class QuizEntity : BaseEntity
    {
        [Required, MaxLength(100)]
        public string Title { get; set; } = default!;

        [Required]
        public string Description { get; set; } = default!;

        public bool isPublic { get; set; }

        [Required, MaxLength(10)]
        public string SharedCode { get; set; } = default!;

        public int? TimeLimitSeconds { get; set; } = null;

        [Required]
        public string OwnerId { get; set; } = default!;
        public UserEntity Owner { get; set; } = default!; 

        public virtual ICollection<QuestionEntity> Questions { get; set; } = [];
        public virtual ICollection<AttemptEntity> Attempts { get; set; } = [];
    }
}
