using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.BLL.Dto.AnswerOption;

namespace TestingPlatform.BLL.Dto.AnswerAttempt
{
    public class AnswerAttemptDto
    {
        public string Id { get; set; } = default!;

        public string? TextAnswer { get; set; }

        public bool IsCorrect { get; set; }

        public int EarnedPoints { get; set; }

        public string QuestionId { get; set; } = default!;

        public List<AnswerOptionDto>? SelectedOptions { get; set; }
    }
}
