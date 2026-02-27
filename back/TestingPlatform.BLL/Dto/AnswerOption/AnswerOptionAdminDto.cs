using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestingPlatform.BLL.Dto.AnswerOption
{
    public class AnswerOptionAdminDto
    {
        public string Id { get; set; } = default!;

        public string Text { get; set; } = default!;

        public bool IsCorrect { get; set; }

        public int OrderIndex { get; set; }

        public string QuestionId { get; set; } = default!;
    }
}
