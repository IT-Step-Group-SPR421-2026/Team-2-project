using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.DAL.Entities;
using Microsoft.EntityFrameworkCore;
namespace TestingPlatform.DAL.Repositories.CommentReaction
{
    public class CommentReactionRepository : GenericRepository<CommentReactionEntity>, ICommentReactionRepository
    {
        public CommentReactionRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<int> GetDislikesCountAsync(string commentId)
        {
            return await _context.CommentReactions
                       .CountAsync(x => x.CommentId == commentId && x.ReactionType == ReactionType.Dislike);
        }

        public async Task<int> GetLikesCountAsync(string commentId)
        {
            return await _context.CommentReactions
            .CountAsync(x => x.CommentId == commentId && x.ReactionType == ReactionType.Like);
        }

        public async Task<CommentReactionEntity?> GetUserReactionAsync(string commentId, string userId)
        {
            return await _context.CommentReactions
            .FirstOrDefaultAsync(x => x.CommentId == commentId && x.UserId == userId);
        }
    }
}
