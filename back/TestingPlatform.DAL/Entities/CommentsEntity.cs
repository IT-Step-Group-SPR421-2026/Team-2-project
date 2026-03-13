using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace TestingPlatform.DAL.Entities
{
    public class CommentsEntity : BaseEntity
    {
        [Required]
        [MaxLength(1000)]
        public string? Text { get; set; }

        [Required]
        public string UserId { get; set; } = default!;

        public UserEntity User { get; set; }  = default!;

        [Required]
        public string QuizId { get; set; } = default!;
        [Required]
        public QuizEntity Quiz { get; set; } = default!;


        public DateTime? UpdatedDate { get; set; }

        public ICollection<CommentReactionEntity> Reactions { get; set; } = new List<CommentReactionEntity>();
    }
}
