using CMQuiz.Domain.Entities;

namespace CMQuiz.Application.Requests;

public class QuizItemRequestText : QuizItemRequest
{
    public override QuizItemType Type => QuizItemType.Text;
    public string Placeholder { get; set; } = string.Empty;
}

