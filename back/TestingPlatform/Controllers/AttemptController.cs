using Microsoft.AspNetCore.Mvc;
using TestingPlatform.BLL.Dto.Attempt;
using TestingPlatform.BLL.Dto.Question;
using TestingPlatform.BLL.Services.Attempt;
using TestingPlatform.Extensions;

namespace TestingPlatform.Controllers
{
    [ApiController]
    [Route("api/attempt")]
    public class AttemptController : ControllerBase
    {
        private readonly IAttemptService _attemptService;

        public AttemptController(IAttemptService attemptService)
        {
            _attemptService = attemptService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] CreateAttemptDto dto)
        {
            var response = await _attemptService.CreateAsync(dto);
            return this.ToActionResult(response);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAsync([FromBody] UpdateAttemptDto dto)
        {
            var response = await _attemptService.UpdateAsync(dto);
            return this.ToActionResult(response);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteAsync([FromQuery] string id)
        {
            var response = await _attemptService.DeleteAsync(id);
            return this.ToActionResult(response);
        }

        [HttpGet("by-id")]
        public async Task<IActionResult> GetByIdAsync(string id)
        {
            var response = await _attemptService.GetByIdAsync(id);
            return this.ToActionResult(response);
        }
        [HttpGet("by-user-id")]
        public async Task<IActionResult> GetByUserIdAsync(string id)
        {
            var response = await _attemptService.GetByUserIdAsync(id);
            return this.ToActionResult(response);
        }

        [HttpGet("by-quiz-id")]
        public async Task<IActionResult> GetByQiuzIdAsync(string qiuzId)
        {
            var response = await _attemptService.GetByQuizIdAsync(qiuzId);
            return this.ToActionResult(response);
        }
    }
}
