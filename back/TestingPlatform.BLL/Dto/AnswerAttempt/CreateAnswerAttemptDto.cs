using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestingPlatform.BLL.Dto.AnswerAttempt
{
    public class CreateAnswerAttemptDto
    {
        public string? TextAnswer { get; set; }

        public string QuestionId { get; set; } = default!;

        public List<string>? SelectedOptionIds { get; set; }
    }
}
