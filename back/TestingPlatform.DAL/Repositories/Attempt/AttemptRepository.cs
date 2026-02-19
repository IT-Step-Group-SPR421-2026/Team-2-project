using TestingPlatform.DAL.Entities;

namespace TestingPlatform.DAL.Repositories.Attempt
{
    public class AttemptRepository : GenericRepository<AttemptEntity>, IAttemptRepository
    {
        public AttemptRepository(AppDbContext context) : base(context){}

        public IQueryable<AttemptEntity> Attempts => GetAll();
    }
}
