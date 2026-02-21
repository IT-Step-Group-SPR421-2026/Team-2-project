using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestingPlatform.BLL.Dto.Auth;

namespace TestingPlatform.BLL.Services.Auth
{
    public interface IAuthService
    {
        Task<ServiceResponse>   LoginAsync(LoginDto dto);
        Task<ServiceResponse> RegisterAsync(RegisterDto dto);


    }
}
