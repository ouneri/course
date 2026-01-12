namespace CMQuiz.Web.API.Models;

public class QuizItemRequestTextModel : QuizItemRequestModel
{
    public override string Type => "text";
    public string Placeholder { get; set; } = string.Empty;
}

