using Microsoft.AspNetCore.Mvc;
using TestingPlatform.BLL.Dto.AnswerAttempt;
using TestingPlatform.BLL.Services.AnswerAttempt;
using TestingPlatform.BLL.Services.Attempt;
using TestingPlatform.Extensions;

namespace TestingPlatform.Controllers
{
    [ApiController]
    [Route("api/answerattempt")]

    public class AnswerAttemptController : Controller
    {
        private readonly IAnswerAttemptService _answerAttemptService;
        private readonly IAttemptService _attemptService;

        public AnswerAttemptController(IAnswerAttemptService answerAttemptService , IAttemptService attemptService)
        {
            _answerAttemptService = answerAttemptService;
            _attemptService = attemptService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateAsync(
            [FromBody] CreateAnswerAttemptDto dto,
            [FromQuery] string attemptId)
        {
            var response = await _answerAttemptService.CreateAsync(dto, attemptId);
            return this.ToActionResult(response);
        }

        [HttpGet("by-id")]
        public async Task<IActionResult> GetByIdAsync(string id)
        {
            var response = await _answerAttemptService.GetByIdAsync(id);
            return this.ToActionResult(response);
        }

        [HttpGet("by-attempt")]
        public async Task<IActionResult> GetByAttemptIdAsync(string attemptId)
        {
            var response = await _attemptService.GetByIdAsync(attemptId);
            return this.ToActionResult(response);
        }
    }
}
