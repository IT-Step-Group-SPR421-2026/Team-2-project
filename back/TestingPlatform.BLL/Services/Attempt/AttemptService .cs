using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System.Net;
using System.Reflection.Metadata.Ecma335;
using TestingPlatform.BLL.Dto.Attempt;
using TestingPlatform.DAL.Entities;
using TestingPlatform.DAL.Repositories.Attempt;

namespace TestingPlatform.BLL.Services.Attempt
{
    public class AttemptService : IAttemptService
    {
        private readonly IAttemptRepository _attemptRepository;
        private readonly IMapper _mapper;

        public AttemptService(IAttemptRepository attemptRepository, IMapper mapper)
        {
            _attemptRepository = attemptRepository;
            _mapper = mapper;
        }

        public ServiceResponse isNull(string entityId)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.NotFound,
                Message = $"Спроби з id '{entityId}' не знайдено"
            };
        }

        public async Task<ServiceResponse> CreateAsync(CreateAttemptDto dto)
        {
            var entity = _mapper.Map<AttemptEntity>(dto);

            await _attemptRepository.CreateAsync(entity);

            return new ServiceResponse
            {
                Message = $"Спроба була записана"
            };
        }
        public async Task<ServiceResponse> UpdateAsync(UpdateAttemptDto dto)
        {
            var entity = await _attemptRepository.GetByIdAsync(dto.Id);

            if (entity == null)
            {
                return isNull(dto.Id);
            }

            entity = _mapper.Map(dto, entity);

            await _attemptRepository.UpdateAsync(entity);

            return new ServiceResponse
            {
                Message = $"Спроба '{dto.Id}' перезаписано"
            };
        }
        public async Task<ServiceResponse> DeleteAsync(string id)
        {
            var entity = await _attemptRepository.GetByIdAsync(id);

            if (entity == null)
            {
                return isNull(id);
            }

            await _attemptRepository.DeleteAsync(entity);

            return new ServiceResponse
            {
                Message = $"Спробу з id '{id}' було видалено"
            };
        }

        public async Task<ServiceResponse> GetByIdAsync(string id)
        {
            var entity = await _attemptRepository.GetByIdAsync(id);

            if (entity == null)
            {
                return isNull(id);
            }

            var dto = _mapper.Map<AttemptEntity>(entity);

            return new ServiceResponse
            {
                Message = $"Спроба з id '{id}' знайдена",
                Payload = dto
            };
        }

        public async Task<ServiceResponse> GetByQuizIdAsync(string quizID)
        {
            var entities = await _attemptRepository.GetAll()
                .Where(a => a.QuizId == quizID).ToListAsync();

            if (entities == null)
            {
                return new ServiceResponse
                {
                    Message = $"Спроби до цього тесту не знайдено"
                };
            }

            var dtos = _mapper.Map<List<AttemptEntity>>(entities);

            return new ServiceResponse
            {
                Message = $"Спроби до тесту було знайдено",
                Payload = dtos
            };
        }

        public async Task<ServiceResponse> GetByUserIdAsync(string userId)
        {
            var entities = await _attemptRepository.GetAll()
                .Where(a => a.UserId == userId).ToListAsync();

            if (entities == null)
            {
                return new ServiceResponse
                {
                    Message = $"Спроби цього user не знайдено"
                };
            }

            var dtos = _mapper.Map<List<AttemptEntity>>(entities);

            return new ServiceResponse
            {
                Message = $"Спроби цього user було знайдено",
                Payload = dtos
            };
        }
    }
}