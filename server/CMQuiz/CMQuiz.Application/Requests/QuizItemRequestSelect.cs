using CMQuiz.Domain.Entities;

namespace CMQuiz.Application.Requests;

public class QuizItemRequestSelect : QuizItemRequest
{
    public override QuizItemType Type => QuizItemType.Select;
    public List<string> Options { get; set; } = new();
}

