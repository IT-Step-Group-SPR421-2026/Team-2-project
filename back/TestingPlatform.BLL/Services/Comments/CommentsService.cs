using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.BLL.Dto.Comments;
using TestingPlatform.DAL.Entities;
using TestingPlatform.DAL.Repositories.Comments;
namespace TestingPlatform.BLL.Services.Comments
{

    public class CommentsService : ICommentsService
    {
        private readonly ICommentsRepository _repository;
        private readonly IMapper _mapper;

        public CommentsService(ICommentsRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<ServiceResponse> CreateAsync(CreateCommentsDto dto, string userId)
        {
            var entity = _mapper.Map<CommentsEntity>(dto);

            entity.UserId = userId;

            await _repository.CreateAsync(entity);

            return new ServiceResponse
            {
                Message = "Comment created"
            };
        }

        public async Task<ServiceResponse> DeleteAsync(string id)
        {
            var comment = await _repository.GetByIdAsync(id);

            if (comment == null)
            {
                return new ServiceResponse
                {
                    Message = "Comment not found"
                };
            }

            await _repository.DeleteAsync(comment);

            return new ServiceResponse
            {
                Message = "Comment deleted"
            };
        }

        public async Task<ServiceResponse> GetByQuizIdAsync(string quizId)
        {
                    var comments = await _repository
            .GetAll()
            .Where(x => x.QuizId == quizId)
            .ToListAsync();

        return new ServiceResponse
        {
            Message = "Quiz comments",
            Payload = _mapper.Map<List<CommentsDto>>(comments)
        };
        }

        public async Task<ServiceResponse> GetByUserIdAsync(string userId)
        {
            var comments = await _repository
           .GetAll()
           .Where(x => x.UserId == userId)
           .ToListAsync();

            return new ServiceResponse
            {
                Message = "User comments",
                Payload = _mapper.Map<List<CommentsDto>>(comments)
            };
        }

        public async Task<ServiceResponse> UpdateAsync(string id, UpdateCommentsDto dto)
        {
            var comment = await _repository.GetByIdAsync(id);

            if (comment == null)
            {
                return new ServiceResponse
                {
                    Message = "Comment not found"
                };
            }
            if (comment.UserId != dto.UserId)
            {
                return new ServiceResponse
                {
                    Message = "You can only update your own comments"
                };
            }

            comment.Text = dto.Text;
            comment.UpdatedDate = DateTime.UtcNow;

            await _repository.UpdateAsync(comment);

            return new ServiceResponse
            {
                Message = "Comment updated"
            };
        }
        public async Task<ServiceResponse> GetAllAsync()
        {
            var comments = await _repository.GetAll().ToListAsync();
            var dto = _mapper.Map<List<CommentsDto>>(comments);

            return new ServiceResponse
            {
                Message = "All comments",
                Payload = dto
            };
        }


        public async Task<ServiceResponse> GetByIdAsync(string id)
        {
            var comment = await _repository.GetByIdAsync(id);
            if (comment == null)
                return new ServiceResponse { Message = "Comment not found" };

            return new ServiceResponse
            {
                Message = "Comment found",
                Payload = _mapper.Map<CommentsDto>(comment)
            };
        }
    }
}
