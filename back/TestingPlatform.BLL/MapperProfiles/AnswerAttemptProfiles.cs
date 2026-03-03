using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.BLL.Dto.AnswerAttempt;
using TestingPlatform.DAL.Entities;


namespace TestingPlatform.BLL.MapperProfiles
{
    public class AnswerAttemptProfiles : Profile
    {
        public AnswerAttemptProfiles()
            {
            CreateMap<AnswerAttemptEntity, AnswerAttemptDto>()
             .ForMember(dest => dest.IsCorrect,
                 opt => opt.MapFrom(src => src.isCorrect))
             .ForMember(dest => dest.SelectedOptions,
                 opt => opt.MapFrom(src => src.AnswerOptions));

          
            CreateMap<CreateAnswerAttemptDto, AnswerAttemptEntity>()
                .ForMember(dest => dest.TextAnswer,opt => opt.MapFrom(src => src.TextAnswer))
                .ForMember(dest => dest.QuestionId,opt => opt.MapFrom(src => src.QuestionId))
                .ForMember(dest => dest.AttemptId, opt => opt.Ignore())
                .ForMember(dest => dest.isCorrect, opt => opt.Ignore())
                .ForMember(dest => dest.EarnedPoints, opt => opt.Ignore())
                .ForMember(dest => dest.Attempt, opt => opt.Ignore())
                .ForMember(dest => dest.Question, opt => opt.Ignore())
                .ForMember(dest => dest.AnswerOptions, opt => opt.Ignore());
        }
    }
}
