using AutoMapper;
using Microsoft.EntityFrameworkCore.Query.Internal;
using System.Net;
using TestingPlatform.BLL.Dto.Question;
using TestingPlatform.DAL.Entities;
using TestingPlatform.DAL.Repositories.Question;

namespace TestingPlatform.BLL.Services.Question
{
    public class QuestionService : IQuestionService
    {
        private readonly IQuestionRepository _questionRepository;
        private readonly IMapper _mapper;

        public QuestionService(IQuestionRepository questionRepository, IMapper mapper)
        {
            _questionRepository = questionRepository;
            _mapper = mapper;
        }

        public async Task<ServiceResponse> CreateAsync(CreateQuestionDto dto)
        {
            var entity = _mapper.Map<QuestionEntity>(dto);

            await _questionRepository.CreateAsync(entity);

            return new ServiceResponse
            {
                Message = $"Питання '{dto.Text} додано'"
            };
        }

        public async Task<ServiceResponse> UpdateAsync(UpdateQuestionDto dto)
        {
            var entity = await _questionRepository.GetByIdAsync(dto.Id);

            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.NotFound,
                    Message = $"Питання з id '{dto.Id}' не знайдено"
                };
            }

            entity = _mapper.Map(dto, entity);
            await _questionRepository.UpdateAsync(entity);

            return new ServiceResponse
            {
                IsSuccess = true,
                Message = $"Питання '{dto.Text}' оновлено"
            };
        }

        public async Task<ServiceResponse> DeleteAsync(string id)
        {
            var entity = await _questionRepository.GetByIdAsync(id);

            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.NotFound,
                    Message = $"Питання з id '{id}' не знайдено"
                };
            }

            await _questionRepository.DeleteAsync(entity);

            return new ServiceResponse
            {
                Message = $"Питання '{entity.Id}' видалено"
            };
        }

        public async Task<ServiceResponse> GetAllAsync()
        {
            var entities = _questionRepository.GetAll().ToList();

            var dtos = _mapper.Map<List<QuestionDto>>(entities);

            return new ServiceResponse
            {
                Message = "Тести отрмано",
                Payload = dtos
            };
        }

        public async Task<ServiceResponse> GetByIdAsync(string id)
        {
            var entity = _questionRepository.GetByIdAsync(id);
            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.NotFound,
                    Message = $"Питання з id '{id}' не знайдено"
                };
            }

            var dto = _mapper.Map<QuestionDto>(entity);

            return new ServiceResponse
            {
                Message = $"Питання з id '{id}' знайдено",
                Payload = dto
            };
        }

        public async Task<ServiceResponse> GetByQuizIdAsync(string quizId)
        {
            var entities = _questionRepository.GetQuestionsByQiuzIdAsync(quizId).ToList();

            if (entities == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.NotFound,
                    Message = $"Питань до тест з id '{quizId}' не знайдено"
                };
            }

            var dtos = _mapper.Map<List<QuestionDto>>(entities);

            return new ServiceResponse
            {
                Message = $"Питань до тест з id '{quizId}' знайдено",
                Payload = dtos
            };
        }
    }
}