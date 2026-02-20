using TestingPlatform.BLL.Dto.Attempt;

namespace TestingPlatform.BLL.Services.Attempt
{
    public interface IAttemptService
    {
        Task<ServiceResponse> CreateAsync(CreateAttemptDto dto);
        Task<ServiceResponse> UpdateAsync(UpdateAttemptDto dto);
        Task<ServiceResponse> DeleteAsync(string id);
        Task<ServiceResponse> GetByIdAsync(string id);
        Task<ServiceResponse> GetByUserIdAsync(string userId);
        Task<ServiceResponse> GetByQuizIdAsync(string quizID);

    }
}