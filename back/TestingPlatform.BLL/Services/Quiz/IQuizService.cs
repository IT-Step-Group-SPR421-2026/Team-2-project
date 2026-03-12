using TestingPlatform.BLL.Dto.Qiuz;
using TestingPlatform.DAL.Entities;

namespace TestingPlatform.BLL.Services.Quiz
{
    public interface IQuizService
    {
        Task<ServiceResponse> CreateAsync(CreateQuizDto dto);
        Task<ServiceResponse> UpdateAsync(UpdateQuizDto dto);
        Task<ServiceResponse> DeleteAsync(string id);
        Task<ServiceResponse> GetAllAsync(string lang);
        Task<ServiceResponse> GetByIdAsync(string id, string lang);
        Task<ServiceResponse> GetBySharedCodeAsync(string code, string lang);
        Task<ServiceResponse> Like(string id);
        Task<ServiceResponse> Dislike(string id);
    }
}
