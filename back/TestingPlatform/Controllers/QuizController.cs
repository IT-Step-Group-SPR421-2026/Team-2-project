using Microsoft.AspNetCore.Mvc;
using TestingPlatform.BLL.Dto.Qiuz;
using TestingPlatform.BLL.Services.Quiz;
using TestingPlatform.Extensions;

namespace TestingPlatform.Controllers
{
    [ApiController]
    [Route("api/quiz")]
    public class QuizController : ControllerBase
    {
        private readonly IQuizService _quizService;

        public QuizController(IQuizService quizService)
        {
            _quizService = quizService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] CreateQuizDto dto)
        {
            var response = await _quizService.CreateAsync(dto);
            return this.ToActionResult(response);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAsync([FromBody] UpdateQuizDto dto)
        {
            var response = await _quizService.UpdateAsync(dto);
            return this.ToActionResult(response);
        }
        [HttpDelete]
        public async Task<IActionResult> DeleteAsync([FromQuery] string id)
        {
            var response = await _quizService.DeleteAsync(id);
            return this.ToActionResult(response);
        }
        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            var response = await _quizService.GetAllAsync();
            return this.ToActionResult(response);
        }
        [HttpGet("by-id")]
        public async Task<IActionResult> GetByIdAsync([FromQuery] string id)
        {
            var response = await _quizService.GetByIdAsync(id);
            return this.ToActionResult(response);
        }
        [HttpGet("by-shared-code")]
        public async Task<IActionResult> GetBySharedCodeAsync([FromQuery] string code)
        {
            var response = await _quizService.GetBySharedCodeAsync(code);
            return this.ToActionResult(response);
        }
    }
}
