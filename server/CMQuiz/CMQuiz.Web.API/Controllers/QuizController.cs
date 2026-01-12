using CMQuiz.Application.Interfaces;
using CMQuiz.Application.Requests;
using CMQuiz.Domain.Entities;
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
        var dto = MapToDto(quiz);
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

        var dto = MapToDto(quiz);
        return Ok(dto);
    }

    private static QuizModel MapToDto(Quiz quiz)
    {
        return new QuizModel
        {
            Id = quiz.Id,
            Name = quiz.Name,
            Description = quiz.Description,
            Items = quiz.Items.Select(item => MapItemToDto(item, quiz.Id)).ToList()
        };
    }

    private static QuizItemModel MapItemToDto(QuizItem item, int quizId)
    {
        var dto = new QuizItemModel
        {
            Id = item.Id,
            QuizId = quizId,
            Type = item.Type.ToString().ToLower()
        };

        switch (item)
        {
            case QuizItemSelect select:
                dto.Options = select.Options;
                break;
            case QuizItemText text:
                dto.Placeholder = text.Placeholder;
                break;
            case QuizItemRange range:
                dto.Min = range.Min;
                dto.Max = range.Max;
                break;
        }

        return dto;
    }
}

