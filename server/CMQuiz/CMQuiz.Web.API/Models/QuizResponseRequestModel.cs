namespace CMQuiz.Web.API.Models;

public class QuizResponseRequestModel
{
    public Dictionary<int, object> Answers { get; set; } = new();
}

