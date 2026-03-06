using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.BLL.Dto.AnswerOption;
using TestingPlatform.BLL.Services.Translation;
using TestingPlatform.DAL.Entities;
using TestingPlatform.DAL.Repositories.AnswerOption;

namespace TestingPlatform.BLL.Services.AnswerOption
{
    public class AnswerOptionService : IAnswerOptionService
    {
        private readonly IAnswerOptionRepository _repository;
        private readonly IMapper _mapper;
        private readonly ITranslationService _translationService;

        public AnswerOptionService(
            IAnswerOptionRepository repository,
            IMapper mapper, ITranslationService translationService)
        {
            _repository = repository;
            _mapper = mapper;
            _translationService = translationService;
        }

        public async Task<ServiceResponse> GetByQuestionIdAsync(string questionId, string lang)
        {
            var entities = await _repository.GetByQuestionIdAsync(questionId);

            var dtos = _mapper.Map<List<AnswerOptionDto>>(entities);

            if (lang == "eng")
            {
                dtos = await _translationService.TranslateRangeOfObjectsAsync(dtos);
            }

            return new ServiceResponse
            {
                Message = $"Спроба з id '{questionId}' знайдена",
                Payload = dtos
            };


        }

        public async Task<ServiceResponse> GetByIdAsync(string id, string lang)
        {
            var entity = await _repository.GetByIdAsync(id);

            if (entity == null)
                return null;

            var dto = _mapper.Map<AnswerOptionAdminDto>(entity);

            if (lang == "eng")
            {
                dto = await _translationService.TranslateObjectAsync(dto);
            }

            return new ServiceResponse
            {
                Message = $"Спроба з id '{id}' знайдена",
                Payload = dto
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

        public async Task<ServiceResponse> GetAllAsync(string lang)
        {
            var entities = await _repository.GetAll().ToListAsync();
            
            var dtos = _mapper.Map<List<AnswerOptionDto>>(entities);

            if (lang == "eng")
            {
                dtos = await _translationService.TranslateRangeOfObjectsAsync(dtos);
            }

            return new ServiceResponse
            {
                Message = "Всі варіанти відповідей ",
                Payload = dtos
            };
        }
    }
}
