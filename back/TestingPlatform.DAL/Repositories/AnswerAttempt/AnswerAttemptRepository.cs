using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.DAL;
using TestingPlatform.DAL.Entities;
using TestingPlatform.DAL.Repositories;

namespace TestingPlatform.BLL.Services.AnswerAttempt
{
    public class AnswerAttemptRepository : GenericRepository<AnswerAttemptEntity> , IAnswerAttemptRepository
    {
        public AnswerAttemptRepository(AppDbContext context) : base(context) { }


        public async Task<List<AnswerAttemptEntity>> GetByUserIdAsync(string userId)
        {
            return await _context.AnswerAttempts
            .Include(x => x.Attempt)
            .Include(x => x.Question)
            .Where(x => x.Attempt.UserId == userId)
            .ToListAsync();
        }

        public async Task<List<AnswerAttemptEntity>> GetByTestIdAsync(string testId)
        {
            return await _context.AnswerAttempts
            .Include(x => x.Question)
            .Where(x => x.Question.Quiz.Id == testId)
            .ToListAsync();
        }

    }
}
