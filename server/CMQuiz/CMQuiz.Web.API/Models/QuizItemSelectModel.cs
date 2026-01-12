namespace CMQuiz.Web.API.Models;

public class QuizItemSelectModel : QuizItemModel
{
    public override string Type => "select";
    public List<string> Options { get; set; } = new();
}

