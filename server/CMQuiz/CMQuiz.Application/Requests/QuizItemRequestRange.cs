using CMQuiz.Domain.Entities;

namespace CMQuiz.Application.Requests;

public class QuizItemRequestRange : QuizItemRequest
{
    public override QuizItemType Type => QuizItemType.Range;
    public int Min { get; set; }
    public int Max { get; set; }
}

