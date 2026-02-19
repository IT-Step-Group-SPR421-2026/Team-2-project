using System.ComponentModel.DataAnnotations;

namespace TestingPlatform.DAL.Entities
{
    public enum Role {
        Student = 0, 
        Teacher = 1,
        Admin = 2
    }
    public class UserEntity : BaseEntity
    {
        [Required, MaxLength(100)]
        public string Name { get; set; } = default!;

        [Required, MaxLength(100)]
        public string Email { get; set; } = default!;

        [Required]
        public string HashPassword { get; set; } = default!;

        [Required]
        public Role Role { get; set; }

        public virtual ICollection<QuizEntity> Quizes { get; set; } = [];
        public virtual ICollection<AttemptEntity> Attempts { get; set; } = [];

    }
}
