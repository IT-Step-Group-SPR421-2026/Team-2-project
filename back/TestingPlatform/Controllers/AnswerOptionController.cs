using Microsoft.AspNetCore.Mvc;
using TestingPlatform.BLL.Dto.AnswerOption;
using TestingPlatform.BLL.Services.AnswerOption;
using TestingPlatform.Extensions;

namespace TestingPlatform.Controllers
{
    [ApiController]
    [Route("api/answeroption")]
    public class AnswerOptionController : Controller
    {
        private readonly IAnswerOptionService _answerOptionService;

        public AnswerOptionController(IAnswerOptionService answerOptionService)
        {
            _answerOptionService = answerOptionService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllAsync([FromQuery] string lang)
        {
            var response = await _answerOptionService.GetAllAsync(lang);
            return this.ToActionResult(response);
        }


        [HttpGet("by-question")]
        public async Task<IActionResult> GetByQuestionIdAsync([FromQuery] string questionId, [FromQuery] string lang)
        {
            var response = await _answerOptionService.GetByQuestionIdAsync(questionId, lang);
            return this.ToActionResult(response);
        }


        [HttpGet("by-id")]
        public async Task<IActionResult> GetByIdAsync([FromQuery] string id, [FromQuery] string lang)
        {
            var response = await _answerOptionService.GetByIdAsync(id, lang);
            return this.ToActionResult(response);
        }


        [HttpPost("create")]
        public async Task<IActionResult> CreateAsync([FromBody] CreateAnswerOptionDto dto)
        {
            var response = await _answerOptionService.CreateAsync(dto);
            return this.ToActionResult(response);
        }


        [HttpPut("update")]
        public async Task<IActionResult> UpdateAsync([FromBody] AnswerOptionAdminDto dto)
        {
            var response = await _answerOptionService.UpdateAsync(dto);
            return this.ToActionResult(response);
        }


        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteAsync([FromQuery] string id)
        {
            var response = await _answerOptionService.DeleteAsync(id);
            return this.ToActionResult(response);
        }

    }
}
 