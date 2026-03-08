using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.DAL.Entities;
using Microsoft.EntityFrameworkCore;
namespace TestingPlatform.DAL.Repositories.Comments
{
    public class CommentsRepository : GenericRepository<CommentsEntity>, ICommentsRepository
    {


        public CommentsRepository(AppDbContext context) : base(context)
        {
        }

        public IQueryable<CommentsEntity> Comments => _context.Comments;

        public async Task<IEnumerable<CommentsEntity>> GetCommentsByQuizIdAsync(string quizId)
        {
            return await _context.Comments
                                 .Where(c => c.QuizId == quizId)
                                 .OrderByDescending(c => c.UpdatedDate ?? c.CreatedDate)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<CommentsEntity>> GetCommentsByUserIdAsync(string userId)
        {
            return await _context.Comments
                                 .Where(c => c.UserId == userId)
                                 .OrderByDescending(c => c.UpdatedDate ?? c.CreatedDate)
                                 .ToListAsync();
        }
        public async Task<CommentsEntity?> RenameCommentAsync(string commentId, string newText)
        {

            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId);

            if (comment == null)
                return null; 


            comment.Text = newText;


            comment.UpdatedDate = DateTime.UtcNow;


            await _context.SaveChangesAsync();

            return comment;
        }
    }
}
