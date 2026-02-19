using TestingPlatform.DAL.Entities;

namespace TestingPlatform.DAL.Repositories
{
    public interface IGenericRepository<TEntity>
        where TEntity : class, IBaseEntity
    {
        Task CreateAsync(TEntity entity);
        Task CreateRangeAsync(params TEntity[] entitties);
        Task DeleteAsync(TEntity entity);
        Task UpdateAsync(TEntity entity);
        Task<TEntity> GetByIdAsync(string id);
        IQueryable<TEntity> GetAll();
    }
}
