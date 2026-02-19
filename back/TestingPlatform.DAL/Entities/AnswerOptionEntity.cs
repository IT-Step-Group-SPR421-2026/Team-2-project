using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TestingPlatform.DAL.Entities
{
    public class AnswerOptionEntity : BaseEntity
    {
        [Required]
        public string Text { get; set; } = default!;

        public bool isCorrect { get; set; }
        public int OrderIndex { get; set; }

        [Required]
        public string QuestionId { get; set; } = default!;
        public QuestionEntity Question { get; set; } = default!;

        public virtual ICollection<AnswerAttemptEntity> AnswerAttempts { get; set; } = [];
    }
}
