using Microsoft.AspNetCore.Mvc;
using TestingPlatform.BLL.Dto.Auth;
using TestingPlatform.BLL.Services.Auth;
using TestingPlatform.Extensions;
namespace TestingPlatform.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : Controller
    {
        private readonly IAuthService _authService;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public AuthController(IAuthService authService, IWebHostEnvironment environment)
        {
            _authService = authService;
            _webHostEnvironment = environment;
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginDto dto)
        {
            var response = await _authService.LoginAsync(dto);
            return this.ToActionResult(response);
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterDto dto)
        {
            var rootPath = _webHostEnvironment.ContentRootPath;
            var imagePath = Path.Combine(rootPath, "storage", "images");

            var response = await _authService.RegisterAsync(dto, imagePath);
            return this.ToActionResult(response);
        }

        [HttpPut("subscription")]
        public async Task<IActionResult> UpdateSubscriptionAsync([FromBody] UpdateSubscriptionDto dto)
        {
            var response = await _authService.UpdateSubscriptionAsync(dto);
            return this.ToActionResult(response);
        }
    }
}
