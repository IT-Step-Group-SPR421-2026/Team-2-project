using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.BLL.Dto.AnswerAttempt;
using TestingPlatform.DAL.Entities;
using TestingPlatform.DAL.Repositories.AnswerOption;
using Microsoft.EntityFrameworkCore;
namespace TestingPlatform.BLL.Services.AnswerAttempt
{
    public class AnswerAttemptService : IAnswerAttemptService
    {
        private readonly IAnswerAttemptRepository _repository;
        private readonly IAnswerOptionRepository _answerOptionRepository;
        private readonly IMapper _mapper;

        public AnswerAttemptService(
            IAnswerAttemptRepository repository,
            IAnswerOptionRepository answerOptionRepository,
            IMapper mapper)
        {
            _repository = repository;
            _answerOptionRepository = answerOptionRepository;
            _mapper = mapper;
        }

        public async Task<ServiceResponse> GetByTestIdAsync(string testId)
        {
            var entities = await _repository.GetByTestIdAsync(testId);

            return new ServiceResponse
            {
                Message = $"Тест по id {testId} testId",
                Payload = _mapper.Map<IEnumerable<AnswerAttemptDto>>(entities)
            };
            
        }

        public async Task<ServiceResponse> GetByUserIdAsync(string userId)
        {
            var entities = await _repository.GetByUserIdAsync(userId);

            return new ServiceResponse
            {
                Message = $"Юзер по id {userId} testId",
                Payload = _mapper.Map<IEnumerable<AnswerAttemptDto>>(entities)
            };

        }

        public async Task<ServiceResponse> GetByIdAsync(string id)
        {
            var entity = await _repository.GetByIdAsync(id);

            if (entity == null)
                return new ServiceResponse
                {

                    Message = "Елемент не знайдено",
                    Payload = null
                };



            return new ServiceResponse { Message = $"Елемент знайдений ", Payload = _mapper.Map<AnswerAttemptDto>(entity) };
        }

        public async Task<ServiceResponse> CreateAsync(CreateAnswerAttemptDto dto, string attemptId)
        {

            var selectedOptions = new List<AnswerOptionEntity>();

            if (dto.SelectedOptionIds != null && dto.SelectedOptionIds.Any())
            {
                var optionIds = dto.SelectedOptionIds
                    .Where(x => !string.IsNullOrWhiteSpace(x))
                    .Distinct()
                    .ToList();

                foreach (var optionId in optionIds)
                {
                    var existingOption = await _answerOptionRepository.GetByIdAsync(optionId);
                    if (existingOption != null)
                    {
                        selectedOptions.Add(existingOption);
                    }
                }

            }
            if (!selectedOptions.Any() && string.IsNullOrWhiteSpace(dto.TextAnswer))
            {
                return new ServiceResponse
                {
                                Message = "Не вибрано жодної відповіді",
                   
                };
            }

            var entity = _mapper.Map<AnswerAttemptEntity>(dto);

            entity.AttemptId = attemptId;
            entity.AnswerOptions = selectedOptions;


            entity.isCorrect = selectedOptions.All(x => x.isCorrect);
            entity.EarnedPoints = entity.isCorrect ? 1 : 0;

            await _repository.CreateAsync(entity);

            return new ServiceResponse
            {
                Message = $"Елемент створений",
                Payload = _mapper.Map<AnswerAttemptDto>(entity)
            };

        }

        public async Task<ServiceResponse> DeleteAsync(string id)
        {
            var entity = await _repository.GetByIdAsync(id);

            if (entity == null)
                return new ServiceResponse
                {
                    Message = $"Нічого по такій id {id} не знайдено"
                };

            await _repository.DeleteAsync(entity);


            return new ServiceResponse
            {
                Message = $"Елемент по id {id} видалений"
            };
        }
    }
}
