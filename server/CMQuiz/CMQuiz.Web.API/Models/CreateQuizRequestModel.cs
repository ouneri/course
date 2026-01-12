namespace CMQuiz.Web.API.Models;

public class CreateQuizRequestModel
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<QuizItemRequestModel> Items { get; set; } = new();
}

