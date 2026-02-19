using TestingPlatform.DAL.Entities;

namespace TestingPlatform.DAL.Repositories.Quiz
{
    public class QuizRepository : GenericRepository<QuizEntity>, IQuizRepository
    {
        public QuizRepository(AppDbContext context) : base(context) { }
        public IQueryable<QuizEntity> Quizzes => GetAll();
    }
}
