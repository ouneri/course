namespace CMQuiz.Web.API.Models;

public class QuizItemRequestRangeModel : QuizItemRequestModel
{
    public override string Type => "range";
    public int Min { get; set; }
    public int Max { get; set; }
}

