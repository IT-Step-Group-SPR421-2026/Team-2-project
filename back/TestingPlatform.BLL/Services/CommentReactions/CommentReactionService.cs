using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.DAL.Entities;
using TestingPlatform.DAL.Repositories.CommentReaction;
using Microsoft.EntityFrameworkCore;
namespace TestingPlatform.BLL.Services.CommentReactions
{
    public class CommentReactionService : ICommentReactionService
    {
        private readonly ICommentReactionRepository _reactionRepository;

        public CommentReactionService(ICommentReactionRepository reactionRepository)
        {
            _reactionRepository = reactionRepository;
        }
        public async Task<ServiceResponse> GetLikesCountAsync(string commentId)
        {
            var count = await _reactionRepository.GetAll()
                .Where(r => r.CommentId == commentId && r.ReactionType == ReactionType.Like)
                .CountAsync();

            return new ServiceResponse
            {
                IsSuccess = true,
                Payload = count
            };
        }

        public async Task<ServiceResponse> GetDislikesCountAsync(string commentId)
        {
            var count = await _reactionRepository.GetAll()
                .Where(r => r.CommentId == commentId && r.ReactionType == ReactionType.Dislike)
                .CountAsync();

            return new ServiceResponse
            {
                IsSuccess = true,
                Payload = count
            };
        }

        public async Task<ServiceResponse> ToggleLikeAsync(string commentId, string userId)
        {
            var reaction = await _reactionRepository.GetUserReactionAsync(commentId, userId);

            if (reaction == null)
            {
                await _reactionRepository.CreateAsync(new CommentReactionEntity
                {
                    CommentId = commentId,
                    UserId = userId,
                    ReactionType = ReactionType.Like
                });
                return new ServiceResponse
                {
                    IsSuccess = true,
                    Message = "Лайк поставлено"
                };
            }

            if (reaction.ReactionType == ReactionType.Like)
            {
                await _reactionRepository.DeleteAsync(reaction);
                return new ServiceResponse
                {
                    IsSuccess = true,
                    Message = "Лайк видалено"
                };
            }


            reaction.ReactionType = ReactionType.Like;
            await _reactionRepository.UpdateAsync(reaction);
            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Лайк змінено"
            };
        }

        public async Task<ServiceResponse> ToggleDislikeAsync(string commentId, string userId)
        {
            var reaction = await _reactionRepository.GetUserReactionAsync(commentId, userId);

            if (reaction == null)
            {
                await _reactionRepository.CreateAsync(new CommentReactionEntity
                {
                    CommentId = commentId,
                    UserId = userId,
                    ReactionType = ReactionType.Dislike
                });
                return new ServiceResponse
                {
                    IsSuccess = true,
                    Message = "Дизлайк поставлено"
                };
            }

            if (reaction.ReactionType == ReactionType.Dislike)
            {
                await _reactionRepository.DeleteAsync(reaction);
                return new ServiceResponse
                {
                    IsSuccess = true,
                    Message = "Дизлайк видалено"
                };
            }


            reaction.ReactionType = ReactionType.Dislike;
            await _reactionRepository.UpdateAsync(reaction);
            return new ServiceResponse
            {
                IsSuccess = true,
                Message = "Дизлайк змінено"
            };
        }
    }
}
