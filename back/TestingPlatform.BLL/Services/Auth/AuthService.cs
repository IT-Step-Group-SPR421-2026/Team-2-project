using Microsoft.AspNetCore.Identity;
using System.Net;
using TestingPlatform.BLL.Dto;
using TestingPlatform.BLL.Dto.Auth;
using TestingPlatform.DAL.Entities;
using TestingPlatform.DAL.Entities.Identity;

namespace TestingPlatform.BLL.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
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
                UserName = dto.Name,
                Email = dto.Email,
                Name = dto.Name
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = string.Join(", ", result.Errors.Select(x => x.Description))
                };
            }

            return new ServiceResponse
            {
                Message = "Успішна реєстрація"
            };
        }

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

            var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);

            if (!result.Succeeded)
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
                Message = "Успішний вхід"
            };
        }
    }
}