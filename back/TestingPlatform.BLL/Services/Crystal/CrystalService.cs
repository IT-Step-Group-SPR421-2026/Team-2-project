using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.DAL.Repositories.User;

namespace TestingPlatform.BLL.Services.Crystal
{
    public class CrystalService : ICrystalService
    {
        private readonly IUserRepository _userRepository;

        public CrystalService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<ServiceResponse> GetCrystals(string userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "User not found"
                };
            }

            return new ServiceResponse
            {
                Message = "User crystals",
                Payload = user.Crystals
            };
        }

        public async Task<ServiceResponse> AddCrystals(string userId, int amount)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "User not found"
                };
            }

            user.Crystals += amount;

            await _userRepository.UpdateAsync(user);

            return new ServiceResponse
            {
                Message = "Crystals added",
                Payload = user.Crystals
            };
        }

        public async Task<ServiceResponse> SpendCrystals(string userId, int amount)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "User not found"
                };
            }

            if (user.Crystals < amount)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Not enough crystals"
                };
            }

            user.Crystals -= amount;

            await _userRepository.UpdateAsync(user);

            return new ServiceResponse
            {
                Message = "Crystals spent",
                Payload = user.Crystals
            };
        }
    }
}
