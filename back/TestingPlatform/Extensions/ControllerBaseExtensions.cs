using Microsoft.AspNetCore.Mvc;
using TestingPlatform.BLL.Services;

namespace TestingPlatform.Extensions
{
    public static class ControllerBaseExtensions
    {
        public static IActionResult ToActionResult(this ControllerBase controller, ServiceResponse response)
        {
            return controller.StatusCode((int)response.StatusCode, response);
        }
    }
}
