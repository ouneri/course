namespace CMQuiz.Domain.Entities;

public class QuizResponse
{
    public int Id { get; set; }
    public int QuizId { get; set; }
    public int UserId { get; set; }
    public Dictionary<int, object> Answers { get; set; } = new(); // itemId -> answer value
}

