using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TestingPlatform.BLL.Dto.Comments;
using TestingPlatform.BLL.Services.Comments;
using TestingPlatform.Extensions;

namespace TestingPlatform.Controllers
{
    [Route("api/comments")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentsService _commentsService;

        public CommentsController(ICommentsService commentsService)
        {
            _commentsService = commentsService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var response = await _commentsService.GetAllAsync();
            return this.ToActionResult(response);
        }

        [HttpGet("id")]
        public async Task<IActionResult> GetById(string id)
        {
            var response = await _commentsService.GetByIdAsync(id);
            return this.ToActionResult(response);
        }

        [HttpGet("quiz")]
        public async Task<IActionResult> GetByQuiz(string quizId)
        {
            var response = await _commentsService.GetByQuizIdAsync(quizId);
            return this.ToActionResult(response);
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetByUser(string userId)
        {
            var response = await _commentsService.GetByUserIdAsync(userId);
            return this.ToActionResult(response);
        }

        //[Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(CreateCommentsDto dto)
        {


            var response = await _commentsService.CreateAsync(dto, dto.UserId);

            return this.ToActionResult(response);
        }

        //[Authorize]
        [HttpPut("id")]
        public async Task<IActionResult> Update(string id, UpdateCommentsDto dto)
        {
            var response = await _commentsService.UpdateAsync(id, dto);
            return this.ToActionResult(response);
        }

        //[Authorize]
        [HttpDelete("id")]
        public async Task<IActionResult> Delete(string id)
        {
            var response = await _commentsService.DeleteAsync(id);
            return this.ToActionResult(response);
        }
    }
}
