namespace CMQuiz.Web.API.Models;

public class QuizItemRangeModel : QuizItemModel
{
    public override string Type => "range";
    public int Min { get; set; }
    public int Max { get; set; }
}

