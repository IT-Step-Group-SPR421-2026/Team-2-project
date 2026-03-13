using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.BLL.Dto.User;
using TestingPlatform.DAL.Repositories.User;

namespace TestingPlatform.BLL.Services.User
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<ServiceResponse> GetUserByIdAsync(string userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    StatusCode = System.Net.HttpStatusCode.NotFound,
                    Message = "Користувача не знайдено"
                };
            }

            var dto = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                SubscriptionStatus = user.SubscriptionStatus,
                TestLimit = user.TestLimit
            };

            return new ServiceResponse
            {
                IsSuccess = true,
                StatusCode = HttpStatusCode.OK,
                Message = "User found",
                Payload = dto
            };
        }
    }
}
