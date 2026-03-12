
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
using TestingPlatform.BLL.Dto.User;
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

        private static UserDto MapUserDto(UserEntity user)
        {
            return new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                SubscriptionStatus = user.SubscriptionStatus,
                TestLimit = user.TestLimit,
            };
        }

        private static int ResolveTestLimit(SubscriptionStatus status)
        {
            return status switch
            {
                SubscriptionStatus.Premium => SubscriptionPlanLimits.PremiumTestLimit,
                _ => SubscriptionPlanLimits.StandardTestLimit,
            };
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
                Payload = new { User = MapUserDto(user) }
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
                Role = dto.Role,
                SubscriptionStatus = SubscriptionStatus.Standard,
                TestLimit = ResolveTestLimit(SubscriptionStatus.Standard),


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
                Message = "Успішна реєстрація",
                Payload = new { User = MapUserDto(user) }
            };
        }

        public async Task<ServiceResponse> UpdateSubscriptionAsync(UpdateSubscriptionDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.UserId))
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Некоректні дані для оновлення підписки",
                };
            }

            if (!Enum.IsDefined(typeof(SubscriptionStatus), dto.SubscriptionStatus))
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Некоректний тип підписки",
                };
            }

            var user = await _UserRepository.GetByIdAsync(dto.UserId);
            if (user == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.NotFound,
                    Message = "Користувача не знайдено",
                };
            }

            user.SubscriptionStatus = dto.SubscriptionStatus;
            user.TestLimit = ResolveTestLimit(dto.SubscriptionStatus);

            await _UserRepository.UpdateAsync(user);

            return new ServiceResponse
            {
                Message = "Підписку оновлено",
                Payload = new { User = MapUserDto(user) },
            };
        }
    }
}
