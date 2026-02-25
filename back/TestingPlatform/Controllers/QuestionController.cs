using Microsoft.AspNetCore.Mvc;
using TestingPlatform.BLL.Dto.Question;
using TestingPlatform.BLL.Services.Question;
using TestingPlatform.Extensions;

namespace TestingPlatform.Controllers
{
    [ApiController]
    [Route("api/question")]
    public class QuestionController : ControllerBase
    {
        private readonly IQuestionService _questionService;

        public QuestionController(IQuestionService questionService)
        {
            _questionService = questionService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] CreateQuestionDto dto)
        {
            var response = await _questionService.CreateAsync(dto);
            return this.ToActionResult(response);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAsync([FromBody] UpdateQuestionDto dto)
        {
            var response = await _questionService.UpdateAsync(dto);
            return this.ToActionResult(response);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteAsync([FromQuery] string id)
        {
            var response = await _questionService.DeleteAsync(id);
            return this.ToActionResult(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            var response = await _questionService.GetAllAsync();
            return this.ToActionResult(response);
        }

        [HttpGet("by-id")]
        public async Task<IActionResult> GetByIdAsync(string id)
        {
            var response = await _questionService.GetByIdAsync(id);
            return this.ToActionResult(response);
        }

        [HttpGet("by-quiz-id")]
        public async Task<IActionResult> GetByQiuzIdAsync(string qiuzId)
        {
            var response = await _questionService.GetByQuizIdAsync(qiuzId);
            return this.ToActionResult(response);
        }
    }
}
