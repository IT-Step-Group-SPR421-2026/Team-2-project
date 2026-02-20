using AutoMapper;
using TestingPlatform.BLL.Dto.Question;
using TestingPlatform.DAL.Entities;

namespace TestingPlatform.BLL.MapperProfiles
{
    public class QuestionProfile : Profile
    {
        public QuestionProfile()
        {
            CreateMap<CreateQuestionDto, QuestionEntity>()
                .ForMember(dest => dest.QuizId, opt => opt.Ignore());

            CreateMap<UpdateQuestionDto, QuestionEntity>()
                .ForMember(dest => dest.QuizId, opt => opt.Ignore());

            CreateMap<QuestionEntity, QuestionDto>();
        }
    }
}
