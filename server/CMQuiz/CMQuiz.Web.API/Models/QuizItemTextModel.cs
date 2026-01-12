namespace CMQuiz.Web.API.Models;

public class QuizItemTextModel : QuizItemModel
{
    public override string Type => "text";
    public string Placeholder { get; set; } = string.Empty;
}

