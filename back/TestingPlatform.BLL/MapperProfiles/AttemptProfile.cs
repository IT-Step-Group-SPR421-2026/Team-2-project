using AutoMapper;
using TestingPlatform.BLL.Dto.Attempt;
using TestingPlatform.DAL.Entities;

namespace TestingPlatform.BLL.MapperProfiles
{
    public class AttemptProfile : Profile
    {
        public AttemptProfile() 
        {
            CreateMap<CreateAttemptDto, AttemptEntity>()
                .ForMember(dest => dest.QuizId, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore());
        }
    }
}
