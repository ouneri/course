namespace CMQuiz.Application.Requests;

public class CreateQuizRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<QuizItemRequest> Items { get; set; } = new();
}

