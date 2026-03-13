using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TestingPlatform.BLL.Services.CommentReactions;
using TestingPlatform.BLL.Services.User;
using TestingPlatform.Extensions;

namespace TestingPlatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentReactionsController : ControllerBase
    {
        private readonly ICommentReactionService _reactionService;
        private readonly IUserService _userService;


        public CommentReactionsController(ICommentReactionService reactionService , IUserService userService)
        {
            _reactionService = reactionService;
            _userService = userService;
        }


        [HttpPost("like")]
        public async Task<IActionResult> LikeComment(string userId, string commentId)
        {
            var userResponse = await _userService.GetUserByIdAsync(userId);
            if (!userResponse.IsSuccess)
                return this.ToActionResult(userResponse);
            var response = await _reactionService.ToggleLikeAsync(commentId, userId);
            return this.ToActionResult(response);
        }


        [HttpPost("dislike")]
        public async Task<IActionResult> DislikeComment(string userId, string commentId)
        {
            var userResponse = await _userService.GetUserByIdAsync(userId);
            if (!userResponse.IsSuccess)
                return this.ToActionResult(userResponse);
            var response = await _reactionService.ToggleDislikeAsync(commentId, userId);
            return this.ToActionResult(response);
        }


        [HttpGet("likes")]
        public async Task<IActionResult> GetLikes(string commentId)
        {
            var response = await _reactionService.GetLikesCountAsync(commentId);
            return this.ToActionResult(response);
        }


        [HttpGet("dislikes")]
        public async Task<IActionResult> GetDislikes(string commentId)
        {
            var response = await _reactionService.GetDislikesCountAsync(commentId);
            return this.ToActionResult(response);
        }

        
    }
}
