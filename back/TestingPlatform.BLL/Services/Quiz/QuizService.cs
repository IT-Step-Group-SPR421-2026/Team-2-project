using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Net;
using TestingPlatform.BLL.Dto.Qiuz;
using TestingPlatform.DAL.Entities;
using TestingPlatform.DAL.Repositories.Quiz;
using TestingPlatform.DAL.Repositories.User;

namespace TestingPlatform.BLL.Services.Quiz
{
    public class QuizService : IQuizService
    {
        private readonly IQuizRepository _quizRepository;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;


        public QuizService(IQuizRepository quizRepository, IMapper mapper, IUserRepository userRepository)
        {
            _quizRepository = quizRepository;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        public async Task<ServiceResponse> CreateAsync(CreateQuizDto dto)
        {
            var entity = _mapper.Map<QuizEntity>(dto);
            var user = await _userRepository.GetByIdAsync(dto.OwnerId);
            if (user == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.NotFound,
                    Message = $"User з id '{dto.OwnerId}' не знайдено"
                };
            }


            entity.SharedCode = Guid.NewGuid().ToString("N").Substring(0, 10);

            entity.Owner = user;

            await _quizRepository.CreateAsync(entity);  

            return new ServiceResponse
            {
                Message = $"Тест '{entity.Title}' додано"
            };
        }

        public async Task<ServiceResponse> UpdateAsync(UpdateQuizDto dto)
        {
            var entity = await _quizRepository.GetByIdAsync(dto.Id);

            if(entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.NotFound,
                    Message = $"Тест з id '{dto.Id}' не знайдено"
                };
            }

            entity = _mapper.Map(dto, entity);

            await _quizRepository.UpdateAsync(entity);

            return new ServiceResponse
            {
                Message = $"Тест '{entity.Title}' оновлено"
            };
        }

        public async Task<ServiceResponse> DeleteAsync(string id)
        {
            var entity = await _quizRepository.GetByIdAsync(id);

            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.NotFound,
                    Message = $"Тест з id '{id}' не знайдено"
                };
            }

            await _quizRepository.DeleteAsync(entity);

            return new ServiceResponse
            {
                Message = $"Тест '{entity.Title}' видалено"
            };
        }

        public async Task<ServiceResponse> GetAllAsync()
        {
            var entities = await _quizRepository.Quizzes.ToListAsync();
            var  dtoes = _mapper.Map<List<QuizDto>>(entities);

            return new ServiceResponse
            {
                Message = "Тести знайдено",
                IsSuccess = true,
                Payload = dtoes
            };
        }

        public async Task<ServiceResponse> GetByIdAsync(string id)
        {
            var entity = await _quizRepository.GetByIdAsync(id);

            if(entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.NotFound,
                    Message = $"Тест з id '{id}' не знайдено"
                };
            }

            var dto = _mapper.Map<QuizDto>(entity);

            return new ServiceResponse
            {
                Message = $"Тест з id '{id}' знайдено",
                IsSuccess = true,
                Payload = dto
            };
        }
        public async Task<ServiceResponse> GetBySharedCodeAsync(string code)
        {
            var entity = await _quizRepository.GetBySharedCodeAsync(code);
            if (entity == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.NotFound,
                    Message = $"Тест з SharedCode '{code}' не знайдено"
                };
            }

            var dto = _mapper.Map<QuizDto>(entity);

            return new ServiceResponse
            {
                Message = $"Тест з SharedCode '{code}' не знайдено",
                IsSuccess = true,
                Payload = dto
            };
        }
    }
}
