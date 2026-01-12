namespace CMQuiz.Web.API.Models;

public class QuizModel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<QuizItemModel> Items { get; set; } = new();
}

