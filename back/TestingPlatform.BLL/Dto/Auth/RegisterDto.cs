using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestingPlatform.BLL.Dto.Auth
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "Поле 'Login' є обов'язковим")]
        public required string Login { get; set; }
        [Required(ErrorMessage = "Поле 'FisrtName' є обов'язковим")]
        public required string FisrtName { get; set; }
        [Required(ErrorMessage = "Поле 'LastName' є обов'язковим")]
        public required string LastName { get; set; }
        [Required(ErrorMessage = "Поле 'Password' є обов'язковим")]
        public required string Password { get; set; }
        [Required(ErrorMessage = "Поле 'Email' є обов'язковим")]
        public required string Email { get; set; }
        [Required(ErrorMessage = "Поле 'Role' є обов'язковим")]
        public required string Role { get; set; }
    }
}
