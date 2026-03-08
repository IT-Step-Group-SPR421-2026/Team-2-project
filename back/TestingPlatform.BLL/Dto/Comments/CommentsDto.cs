using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestingPlatform.BLL.Dto.Comments
{
    public  class CommentsDto
    {
        public string Id { get; set; } = default!;

        public string Text { get; set; } = default!;

        public string UserId { get; set; } = default!;

        public string QuizId { get; set; } = default!;

        public DateTime CreatedDate { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}
