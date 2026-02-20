using System.ComponentModel.DataAnnotations;

namespace TestingPlatform.BLL.Dto.Attempt
{
    public class UpdateAttemptDto
    {
        [Required]
        public required string Id { get; set; }
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
