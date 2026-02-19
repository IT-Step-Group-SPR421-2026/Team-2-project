using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.BLL.Dto;
using TestingPlatform.BLL.Dto.Auth;
using TestingPlatform.DAL.Entities.Identity;
using TestingPlatform.DAL.Repositories.User;


namespace TestingPlatform.BLL.Services.Auth
{
    internal class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser>? _userManager;
        private readonly IUserRepository UserRepository;
        public async Task<ServiceResponse> LoginAsync(LoginDto dto)
        {
            var user = await _userManager.FindByNameAsync(dto.Name);

            if (user == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Логін вказано невірно"
                };
            }

            bool passwordResult = await _userManager.CheckPasswordAsync(user, dto.HashPassword);

            if (!passwordResult)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Пароль вказано невірно"
                };
            }

           

            return new ServiceResponse
            {
                Message = "Успішний вхід",

            };
        }



        public async Task<ServiceResponse> RegisterAsync(RegisterDto dto)
        {
            if (dto == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Помилка"
                };
            }

            var user = new ApplicationUser
            {
                Email = dto.Email,
                UserName = dto.Name,
                EmailConfirmed = true
            };

            if (!await UserRepository.ExistsByEmailAsync(user.Email))
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Вже є такий акаунт"
                };
            }
            await _userManager!.CreateAsync(user, dto.Password);

            await _userManager.AddToRoleAsync(user, dto.Role);

            return new ServiceResponse
            {
                Message = "Успішна реєстрація"
            };
        }
    }
}
