using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestingPlatform.BLL.Services.CommentReactions
{
    public  interface ICommentReactionService
    {
        Task<ServiceResponse> ToggleLikeAsync(string commentId, string userId);
        Task<ServiceResponse> ToggleDislikeAsync(string commentId, string userId);
        Task<ServiceResponse> GetLikesCountAsync(string commentId);
        Task<ServiceResponse> GetDislikesCountAsync(string commentId);
    }
}
