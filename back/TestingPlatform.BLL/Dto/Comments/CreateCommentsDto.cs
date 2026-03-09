using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestingPlatform.BLL.Dto.Comments
{
    public class CreateCommentsDto
    {
        [Required]
        [MaxLength(1000)]
        public string Text { get; set; } = default!;

        [Required]
        public string QuizId { get; set; } = default!;

        [Required]
        public string UserId { get; set; } = default!;
    }
}
