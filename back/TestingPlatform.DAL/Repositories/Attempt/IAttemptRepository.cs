using TestingPlatform.DAL.Entities;

namespace TestingPlatform.DAL.Repositories.Attempt
{
    public interface IAttemptRepository: IGenericRepository<AttemptEntity>
    {
        IQueryable<AttemptEntity> Attempts { get; }
    }
}
