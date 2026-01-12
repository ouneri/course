namespace CMQuiz.Web.API.Models;

public class QuizItemRequestSelectModel : QuizItemRequestModel
{
    public override string Type => "select";
    public List<string> Options { get; set; } = new();
}

