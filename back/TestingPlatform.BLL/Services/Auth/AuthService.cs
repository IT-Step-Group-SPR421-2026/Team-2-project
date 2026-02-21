
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.BLL.Dto;
using TestingPlatform.BLL.Dto.Auth;
using TestingPlatform.DAL.Entities;
using TestingPlatform.DAL.Repositories.User;


namespace TestingPlatform.BLL.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _UserRepository;
        private readonly PasswordHasher<UserEntity> _hasher = new();

        public AuthService(IUserRepository userRepository)
        {

            _UserRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        }

        public async Task<ServiceResponse> LoginAsync(LoginDto dto)
        {


            var user = await _UserRepository.GetByNameAsync(dto.Name);

            if (user == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Логін вказано невірно"
                };
            }

            var result = _hasher.VerifyHashedPassword(user, user.HashPassword, dto.Password);

            if (result == PasswordVerificationResult.Failed)
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



            var user = new UserEntity
            {
                Id = Guid.NewGuid().ToString(),
                Email = dto.Email,
                Name = dto.Name,
                Role = dto.Role


            };


            if (await _UserRepository.ExistsByEmailAsync(user.Email))
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Вже є такий акаунт"
                };
            }
            var hash = _hasher.HashPassword(user, dto.Password);
            user.HashPassword = hash;

            await _UserRepository.CreateAsync(user);

            return new ServiceResponse
            {
                Message = "Успішна реєстрація"
            };
        }
    }
}
