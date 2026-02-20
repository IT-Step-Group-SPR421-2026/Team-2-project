using TestingPlatform.BLL.Dto.Question;

namespace TestingPlatform.BLL.Services.Question
{
    public interface IQuestionService
    {
        Task<ServiceResponse> CreateAsync(CreateQuestionDto dto);
        Task<ServiceResponse> UpdateAsync(UpdateQuestionDto dto);
        Task<ServiceResponse> DeleteAsync(string id);
        Task<ServiceResponse> GetAllAsync();
        Task<ServiceResponse> GetByIdAsync(string id);
        Task<ServiceResponse> GetByQuizIdAsync(string quizId);
    }
}