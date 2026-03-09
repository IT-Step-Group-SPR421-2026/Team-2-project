using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.BLL.Dto.Comments;

namespace TestingPlatform.BLL.Services.Comments
{
    public interface ICommentsService
    {
        Task<ServiceResponse> CreateAsync(CreateCommentsDto dto, string userId);

        Task<ServiceResponse> GetByQuizIdAsync(string quizId);

        Task<ServiceResponse> GetByUserIdAsync(string userId);

        Task<ServiceResponse> UpdateAsync(string id, UpdateCommentsDto dto);

        Task<ServiceResponse> DeleteAsync(string id);

        Task<ServiceResponse> GetByIdAsync(string id);

        Task<ServiceResponse> GetAllAsync();
    }
}
