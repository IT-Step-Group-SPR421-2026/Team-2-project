using System.ComponentModel.DataAnnotations;

namespace TestingPlatform.DAL.Entities
{
    public enum Role {
        User = 0,
        Admin = 1
    }
    public enum SubscriptionStatus
    {
        Standard = 0,
        Premium = 1
    }

    public static class SubscriptionPlanLimits
    {
        public const int StandardTestLimit = 2;
        public const int PremiumTestLimit = 5;
    }

    public class UserEntity : BaseEntity
    {
        [Required, MaxLength(100)]
        public string Name { get; set; } = default!;

        [Required, MaxLength(100)]
        public string Email { get; set; } = default!;

        [Required]
        public string HashPassword { get; set; } = default!;

        public int Crystals { get; set; } = 0;

        public string? AvatarUrl { get; set; } = null;

        [Required]
        public Role Role { get; set; }

        [Required]
        public SubscriptionStatus SubscriptionStatus { get; set; }

        [Required]
        public int TestLimit { get; set; } = SubscriptionPlanLimits.StandardTestLimit;

        public virtual ICollection<QuizEntity> Quizes { get; set; } = [];
        public virtual ICollection<AttemptEntity> Attempts { get; set; } = [];

        public ICollection<CommentsEntity> Comments { get; set; } = [];
        public  ICollection<CommentReactionEntity> CommentReactions { get; set; } = new List<CommentReactionEntity>();

    }
}
