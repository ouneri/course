namespace CMQuiz.Domain.Entities;

public abstract class QuizItem
{
    public int Id { get; set; }
    public int QuizId { get; set; }
    public QuizItemType Type { get; set; }
}

