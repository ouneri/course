using CMQuiz.Application.Interfaces;
using CMQuiz.Web.API.Attributes;
using CMQuiz.Web.API.Mappers;
using CMQuiz.Web.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace CMQuiz.Web.API.Controllers;

[ApiController]
[Route("api/quizes")]
[Authorize]
public class QuizController(
    ICreateQuizUseCase createQuizUseCase,
    IGetQuizUseCase getQuizUseCase)
    : ControllerBase
{
    /// <summary>
    /// Создать новый квиз
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<QuizModel>> CreateQuiz([FromBody] CreateQuizRequestModel model)
    {
        var request = QuizMapper.ToCreateQuizRequest(model);
        var quiz = await createQuizUseCase.ExecuteAsync(request);
        var dto = QuizMapper.ToQuizModel(quiz);
        return Ok(dto);
    }

    /// <summary>
    /// Получить квиз по ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<QuizModel>> GetQuiz(int id)
    {
        var quiz = await getQuizUseCase.ExecuteAsync(id);
        if (quiz == null)
        {
            return NotFound();
        }

        var dto = QuizMapper.ToQuizModel(quiz);
        return Ok(dto);
    }
}

