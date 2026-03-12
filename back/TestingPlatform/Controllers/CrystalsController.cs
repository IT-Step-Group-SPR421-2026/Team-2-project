using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TestingPlatform.BLL.Services.Crystal;

namespace TestingPlatform.Controllers
{
    [ApiController]
    [Route("api/crystals")]
    public class CrystalsController : ControllerBase
    {
        private readonly ICrystalService _crystalService;

        public CrystalsController(ICrystalService crystalService)
        {
            _crystalService = crystalService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCrystals(string userId)
        {
            var result = await _crystalService.GetCrystals(userId);
            return Ok(result);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddCrystals(string userId, int amount)
        {
            var result = await _crystalService.AddCrystals(userId, amount);
            return Ok(result);
        }

        [HttpPost("spend")]
        public async Task<IActionResult> SpendCrystals(string userId, int amount)
        {
            var result = await _crystalService.SpendCrystals(userId, amount);
            return Ok(result);
        }
    }
}