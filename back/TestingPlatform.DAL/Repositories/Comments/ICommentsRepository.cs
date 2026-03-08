using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.DAL.Entities;

namespace TestingPlatform.DAL.Repositories.Comments
{
    public interface ICommentsRepository : IGenericRepository<CommentsEntity>
    {
        IQueryable<CommentsEntity> Comments { get; }
        Task<IEnumerable<CommentsEntity>> GetCommentsByQuizIdAsync(string quizId);

        Task<IEnumerable<CommentsEntity>> GetCommentsByUserIdAsync(string userId);
    }
}
