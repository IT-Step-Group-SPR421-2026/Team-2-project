using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.BLL.Dto.AnswerOption;
using TestingPlatform.DAL.Entities;
using TestingPlatform.DAL.Repositories.AnswerOption;

namespace TestingPlatform.BLL.Services.AnswerOption
{
    public class AnswerOptionService : IAnswerOptionService
    {
        private readonly IAnswerOptionRepository _repository;
        private readonly IMapper _mapper;

        public AnswerOptionService(
            IAnswerOptionRepository repository,
            IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<ServiceResponse> GetByQuestionIdAsync(string questionId)
        {
            var entities = await _repository.GetByQuestionIdAsync(questionId);
            return new ServiceResponse
            {
                Message = $"Спроба з id '{questionId}' знайдена",
                Payload = _mapper.Map<IEnumerable<AnswerOptionDto>>(entities)
            };


        }

        public async Task<ServiceResponse> GetByIdAsync(string id)
        {
            var entity = await _repository.GetByIdAsync(id);

            if (entity == null)
                return null;

            return new ServiceResponse
            {
                Message = $"Спроба з id '{id}' знайдена",
                Payload = _mapper.Map<AnswerOptionAdminDto>(entity)
            };
        }

        public async Task<ServiceResponse> CreateAsync(CreateAnswerOptionDto dto)
        {
            var entity = _mapper.Map<AnswerOptionEntity>(dto);

            await _repository.CreateAsync(entity);


            return new ServiceResponse
            {
                Message = $"Строрено успішно",
                Payload = _mapper.Map<AnswerOptionAdminDto>(entity)
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

        public async Task<ServiceResponse> UpdateAsync(AnswerOptionAdminDto dto)
        {
            var entity = await _repository.GetByIdAsync(dto.Id);

            if (entity == null)
            {
                return new ServiceResponse
                {

                    Message = "AnswerOption не знайдено"
                };
            }

            entity.Text = dto.Text;
            entity.isCorrect = dto.IsCorrect;

            await _repository.UpdateAsync(entity);

            return new ServiceResponse
            {
                Message = "Обновлено відповідь",
                Payload = entity
            };
        }

        public async Task<ServiceResponse> GetAllAsync()
        {
            var entities = await _repository.GetAll().ToListAsync();

            return new ServiceResponse
            {
                Message = "Всі варіанти відповідей ",
                Payload = entities
            };
        }
    }
}
