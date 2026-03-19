using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TestingPlatform.BLL.Services.CommentReactions;
using TestingPlatform.BLL.Services.User;
using TestingPlatform.Extensions;
namespace TestingPlatform.Controllers
{
    [Route("api/User")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly IUserService _userService;


        public UserController(IUserService userService)
        {

            _userService = userService;
        }

        [HttpGet("get-user-by-id")]
        public async Task<IActionResult> GetUserById(string userId)
        {
            var response = await _userService.GetUserByIdAsync(userId);
            return this.ToActionResult(response);
        }
    }
}
