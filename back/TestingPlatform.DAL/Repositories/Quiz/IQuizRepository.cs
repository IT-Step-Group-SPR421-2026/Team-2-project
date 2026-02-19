using TestingPlatform.DAL.Entities;

namespace TestingPlatform.DAL.Repositories.Quiz
{
    public interface IQuizRepository : IGenericRepository<QuizEntity>
    {
        IQueryable<QuizEntity> Quizzes { get; }
    }
}
