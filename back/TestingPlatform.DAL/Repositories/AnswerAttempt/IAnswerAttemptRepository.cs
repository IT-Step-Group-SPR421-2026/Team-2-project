using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.DAL.Entities;
using TestingPlatform.DAL.Repositories;

namespace TestingPlatform.BLL.Services.AnswerAttempt
{
    public interface IAnswerAttemptRepository : IGenericRepository<AnswerAttemptEntity>
    {

        Task <List<AnswerAttemptEntity>> GetByUserIdAsync(string userId);
        Task<List<AnswerAttemptEntity>> GetByTestIdAsync(string testId);
    }
}
