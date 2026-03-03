using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.BLL.Dto.AnswerAttempt;

namespace TestingPlatform.BLL.Services.AnswerAttempt
{
    public interface IAnswerAttemptService
    {
        Task<ServiceResponse> GetByTestIdAsync(string testId);

        Task<ServiceResponse> GetByUserIdAsync(string userId);

        Task<ServiceResponse> GetByIdAsync(string id);

        Task<ServiceResponse> CreateAsync( CreateAnswerAttemptDto dto, string attemptId);

        Task<ServiceResponse> DeleteAsync(string id);
    }
}
