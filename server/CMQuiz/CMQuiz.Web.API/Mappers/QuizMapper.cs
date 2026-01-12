using CMQuiz.Application.Requests;
using CMQuiz.Domain.Entities;
using CMQuiz.Web.API.Models;

namespace CMQuiz.Web.API.Mappers;

public static class QuizMapper
{
    public static CreateQuizRequest ToCreateQuizRequest(CreateQuizRequestModel model)
    {
        return new CreateQuizRequest
        {
            Name = model.Name,
            Description = model.Description,
            Items = model.Items.Select(ToQuizItemRequest).ToList()
        };
    }

    private static QuizItemRequest ToQuizItemRequest(QuizItemRequestModel model)
    {
        return model switch
        {
            QuizItemRequestSelectModel m => new QuizItemRequestSelect
            {
                Options = m.Options
            },
            QuizItemRequestTextModel m => new QuizItemRequestText
            {
                Placeholder = m.Placeholder
            },
            QuizItemRequestRangeModel m => new QuizItemRequestRange
            {
                Min = m.Min,
                Max = m.Max
            },
            _ => throw new ArgumentException("Unknown quiz item type")
        };
    }

    public static QuizModel ToQuizModel(Quiz quiz)
    {
        return new QuizModel
        {
            Id = quiz.Id,
            Name = quiz.Name,
            Description = quiz.Description,
            Items = quiz.Items.Select(item => ToQuizItemModel(item, quiz.Id)).ToList()
        };
    }

    private static QuizItemModel ToQuizItemModel(QuizItem item, int quizId)
    {
        return item switch
        {
            QuizItemSelect select => new QuizItemSelectModel
            {
                Id = item.Id,
                QuizId = quizId,
                Options = select.Options
            },
            QuizItemText text => new QuizItemTextModel
            {
                Id = item.Id,
                QuizId = quizId,
                Placeholder = text.Placeholder
            },
            QuizItemRange range => new QuizItemRangeModel
            {
                Id = item.Id,
                QuizId = quizId,
                Min = range.Min,
                Max = range.Max
            },
            _ => throw new ArgumentException("Unknown quiz item type")
        };
    }

    public static QuizResponseRequest ToQuizResponseRequest(QuizResponseRequestModel model, int quizId)
    {
        return new QuizResponseRequest
        {
            QuizId = quizId,
            Answers = model.Answers
        };
    }

    public static LoginRequest ToLoginRequest(LoginRequestModel model)
    {
        return new LoginRequest
        {
            Username = model.Username,
            Password = model.Password
        };
    }

    public static RegisterRequest ToRegisterRequest(RegisterRequestModel model)
    {
        return new RegisterRequest
        {
            Username = model.Username,
            Password = model.Password
        };
    }
}

