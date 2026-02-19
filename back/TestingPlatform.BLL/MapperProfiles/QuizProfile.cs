using AutoMapper;
using TestingPlatform.BLL.Dto.Qiuz;
using TestingPlatform.DAL.Entities;

namespace TestingPlatform.BLL.MapperProfiles
{
    public class QuizProfile : Profile
    {
        public QuizProfile() 
        {
            CreateMap<CreateQuizDto, QuizEntity>()
                .ForMember(dest => dest.OwnerId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => src.ReleaseDate.ToUniversalTime()));

            CreateMap<UpdateQuizDto, QuizEntity>()
               .ForMember(dest => dest.OwnerId, opt => opt.Ignore())
               .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => src.ReleaseDate.ToUniversalTime()));

            CreateMap<QuizEntity, QuizDto>();
        }
    }
}
