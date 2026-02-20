using Microsoft.EntityFrameworkCore;
using TestingPlatform.DAL.Entities;

namespace TestingPlatform.DAL.Repositories.Quiz
{
    public class QuizRepository : GenericRepository<QuizEntity>, IQuizRepository
    {
        private readonly AppDbContext _context;
        public QuizRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }
        public IQueryable<QuizEntity> Quizzes => GetAll();
        public async Task<QuizEntity> GetBySharedCodeAsync(string code)
        {
            return await _context.Set<QuizEntity>().FirstOrDefaultAsync(q => q.SharedCode == code);
        }
    }
}
