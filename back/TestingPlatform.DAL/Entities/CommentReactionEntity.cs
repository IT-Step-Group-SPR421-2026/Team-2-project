using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestingPlatform.DAL.Entities
{
    public enum ReactionType
    {
        Like = 1,
        Dislike = 2
    }
    public class CommentReactionEntity : BaseEntity
    {

        [Required]
        public string CommentId { get; set; } = default!;

        [ForeignKey(nameof(CommentId))]
        public CommentsEntity Comment { get; set; } = default!;

        [Required]
        public string UserId { get; set; } = default!;

        [ForeignKey(nameof(UserId))]
        public UserEntity User { get; set; } = default!;

        [Required]
        public ReactionType ReactionType { get; set; }
    }
}
