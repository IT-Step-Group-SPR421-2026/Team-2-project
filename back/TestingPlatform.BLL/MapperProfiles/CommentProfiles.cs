using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.BLL.Dto.Comments;
using TestingPlatform.DAL.Entities;

namespace TestingPlatform.BLL.MapperProfiles
{
    public class CommentProfiles : Profile
    {
        public CommentProfiles() {
            CreateMap<CommentsEntity, CommentsDto>();
            CreateMap<CreateCommentsDto, CommentsEntity>();
            CreateMap<UpdateCommentsDto, CommentsEntity>();
        }
    }
}
