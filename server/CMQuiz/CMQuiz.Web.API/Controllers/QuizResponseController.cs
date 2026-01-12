using CMQuiz.Application.Interfaces;
using CMQuiz.Application.Requests;
using CMQuiz.Web.API.Attributes;
using CMQuiz.Web.API.Mappers;
using CMQuiz.Web.API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CMQuiz.Web.API.Controllers;

[ApiController]
[Route("api/quizzes/{quizId}/responses")]
[Authorize]
public class QuizResponseController(ISubmitQuizResponseUseCase submitQuizResponseUseCase) : ControllerBase
{
    /// <summary>
    /// Отправить ответ на квиз
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> SubmitResponse(int quizId, [FromBody] QuizResponseRequestModel model)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized();
        }

        var request = QuizMapper.ToQuizResponseRequest(model, quizId);
        var response = await submitQuizResponseUseCase.ExecuteAsync(request, userId);
        
        return Ok(new { id = response.Id });
    }
}

