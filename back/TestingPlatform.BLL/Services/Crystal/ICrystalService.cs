using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestingPlatform.BLL.Services.Crystal
{
    public interface ICrystalService
    {
        Task<ServiceResponse> GetCrystals(string userId);
        Task<ServiceResponse> AddCrystals(string userId, int amount);
        Task<ServiceResponse> SpendCrystals(string userId, int amount);
    }
}
