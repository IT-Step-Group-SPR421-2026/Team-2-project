using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestingPlatform.BLL.Dto.AnswerOption
{
    public class AnswerOptionForUserDto
    {
        public string Id { get; set; } = default!;

        public string Text { get; set; } = default!;

        public int OrderIndex { get; set; }
    }
}
