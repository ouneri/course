namespace CMQuiz.Application.Requests;

public abstract class QuizItemRequest
{
    public abstract CMQuiz.Domain.Entities.QuizItemType Type { get; }
}

