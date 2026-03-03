using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.BLL.Dto.AnswerOption;

namespace TestingPlatform.BLL.Services.AnswerOption
{
    internal interface IAnswerOptionService
    {
        Task<ServiceResponse> GetByQuestionIdAsync(string questionId);

        Task<ServiceResponse> GetByIdAsync(string id);

        Task<ServiceResponse> CreateAsync(CreateAnswerOptionDto dto);

        Task<ServiceResponse> DeleteAsync(string id);
    }
}
