using TestingPlatform.DAL.Entities;

namespace TestingPlatform.DAL.Repositories.User
{
    public class UserRepository : GenericRepository<UserEntity>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context){}

    }
}
