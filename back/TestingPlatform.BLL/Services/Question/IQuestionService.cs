using TestingPlatform.BLL.Dto.Question;

namespace TestingPlatform.BLL.Services.Question
{
    public interface IQuestionService
    {
        Task<ServiceResponse> CreateAsync(CreateQuestionDto dto);
        Task<ServiceResponse> UpdateAsync(UpdateQuestionDto dto);
        Task<ServiceResponse> DeleteAsync(string id);
        Task<ServiceResponse> GetAllAsync(string lang);
        Task<ServiceResponse> GetByIdAsync(string id, string lang);
        Task<ServiceResponse> GetByQuizIdAsync(string quizId, string lang);
    }
}