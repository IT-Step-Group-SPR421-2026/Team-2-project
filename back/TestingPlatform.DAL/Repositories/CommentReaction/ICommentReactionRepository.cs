using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.DAL.Entities;
namespace TestingPlatform.DAL.Repositories.CommentReaction
{
    public interface ICommentReactionRepository: IGenericRepository<CommentReactionEntity>
    {
        Task<CommentReactionEntity?> GetUserReactionAsync(string commentId, string userId);

        Task<int> GetLikesCountAsync(string commentId);

        Task<int> GetDislikesCountAsync(string commentId);
    }
}
