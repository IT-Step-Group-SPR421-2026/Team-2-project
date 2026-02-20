using TestingPlatform.DAL.Entities;

namespace TestingPlatform.DAL.Repositories.Question
{
    public class QuestionRepository : GenericRepository<QuestionEntity>, IQuestionRepository
    {
        public QuestionRepository(AppDbContext context) : base(context){}

        public IQueryable<QuestionEntity> Questions => GetAll();

        public IQueryable<QuestionEntity> GetQuestionsByQiuzIdAsync(string QuizId)
        {
            return GetAll().Where(q => q.QuizId == QuizId);
        }
    }
}
