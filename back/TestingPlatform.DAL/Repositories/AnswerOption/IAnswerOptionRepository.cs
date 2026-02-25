using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.DAL.Entities;

namespace TestingPlatform.DAL.Repositories.AnswerOption
{
    public interface IAnswerOptionRepository : IGenericRepository<AnswerOptionEntity>
    {


        Task<IEnumerable<AnswerOptionEntity>> GetByQuestionIdAsync(string questionId);
    }
}
