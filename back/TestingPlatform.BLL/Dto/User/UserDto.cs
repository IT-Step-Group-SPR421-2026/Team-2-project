using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.DAL.Entities;

namespace TestingPlatform.BLL.Dto.User
{
    public class UserDto
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Поле 'Name' є обов'язковим")]
        public required string Name { get; set; }
        [Required(ErrorMessage = "Поле 'Email' є обов'язковим")]
        public required string Email { get; set; }
        [Required(ErrorMessage = "Поле 'Role' є обов'язковим")]
        public Role Role { get; set; }
    }
}
