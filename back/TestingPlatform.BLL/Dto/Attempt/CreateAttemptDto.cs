using System.ComponentModel.DataAnnotations;
using TestingPlatform.DAL.Entities;

namespace TestingPlatform.BLL.Dto.Attempt
{
    public class CreateAttemptDto
    {
        public int MaxScore { get; set; }
        public int? Score { get; set; }
        public int? Percentage { get; set; }
        public int? DurationSeconds { get; set; }

        public DateTime? FinishedAt { get; set; }
        public string? StatusString { get; set; }

        [Required]
        public string QuizId { get; set; } = default!;
        [Required]
        public string UserId { get; set; } = default!;
    }
}
