using Microsoft.EntityFrameworkCore;
using TestingPlatform.DAL.Entities;

namespace TestingPlatform.DAL.Repositories.User
{
    public class UserRepository : GenericRepository<UserEntity>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context){}

        public IQueryable<UserEntity> Users => throw new NotImplementedException();

        public Task<bool> ExistsByEmailAsync(string email)
        {
            return Users.AnyAsync(u => u.Email == email);
        }

        public async Task<UserEntity?> GetByEmailAsync(string email)
        {
            return await Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<UserEntity?> GetByNameAsync(string name)
        {
            return await Users
                .FirstOrDefaultAsync(u => u.Name == name);
        }


    }
}
