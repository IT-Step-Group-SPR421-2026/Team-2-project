using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.BLL.Dto.AnswerOption;
using TestingPlatform.DAL.Entities;

namespace TestingPlatform.BLL.MapperProfiles
{
    public class AnswerOptionProfiles : Profile
    {
        public class AnswerOptionProfile : Profile
        {
            public AnswerOptionProfile()
            {

                CreateMap<AnswerOptionEntity, AnswerOptionAdminDto>()
                    .ForMember(dest => dest.IsCorrect,
                        opt => opt.MapFrom(src => src.isCorrect));


                CreateMap<AnswerOptionEntity, AnswerOptionDto>()
                    .ForMember(dest => dest.IsCorrect,
                        opt => opt.MapFrom(src => src.isCorrect));


                CreateMap<AnswerOptionEntity, AnswerOptionForUserDto>();

 
                CreateMap<CreateAnswerOptionDto, AnswerOptionEntity>()
                    .ForMember(dest => dest.isCorrect,
                        opt => opt.MapFrom(src => src.IsCorrect))
                    .ForMember(dest => dest.Question,
                        opt => opt.Ignore())
                    .ForMember(dest => dest.AnswerAttempts,
                        opt => opt.Ignore());
            }
        }
    }
}
