using TestingPlatform.DAL.Entities;

namespace TestingPlatform.DAL.Repositories.User
{
    public interface IUserRepository : IGenericRepository<UserEntity>
    {
        public IQueryable<UserEntity> Users { get; }

        Task<UserEntity?> GetByEmailAsync(string email);


        Task<bool> ExistsByEmailAsync(string email);


    }
}
