using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.DAL.Entities;

namespace TestingPlatform.DAL.Repositories.AnswerOption
{
    public class AnswerOptionRepository : GenericRepository<AnswerOptionEntity>, IAnswerOptionRepository
    {
        public AnswerOptionRepository(AppDbContext context) : base(context) { }


        public async Task<IEnumerable<AnswerOptionEntity>> GetByQuestionIdAsync(string questionId)
        {
            return await _context.AnswerOptions
            .Where(x => x.QuestionId == questionId)
            .ToArrayAsync();
        }
    }
}
