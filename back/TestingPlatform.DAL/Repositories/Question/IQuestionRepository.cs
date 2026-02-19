using TestingPlatform.DAL.Entities;

namespace TestingPlatform.DAL.Repositories.Question
{
    public interface IQuestionRepository : IGenericRepository<QuestionEntity>
    {
        IQueryable<QuestionEntity> Questions { get; }
    }
}
