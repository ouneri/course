namespace CMQuiz.Application.Requests;

public class QuizResponseRequest
{
    public int QuizId { get; set; }
    public Dictionary<int, object> Answers { get; set; } = new(); // itemId -> answer value
}

