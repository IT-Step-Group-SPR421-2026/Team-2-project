using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestingPlatform.BLL.Dto.Auth
{
    public class LoginDto
    {
        [Required(ErrorMessage = "Поле 'Login' є обов'язковим")]
        public required string Name { get; set; }
        [Required(ErrorMessage = "Поле 'Password' є обов'язковим")]
        public required string HashPassword { get; set; }
    }
}
