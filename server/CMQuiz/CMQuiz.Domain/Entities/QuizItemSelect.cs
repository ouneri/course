namespace CMQuiz.Domain.Entities;

public class QuizItemSelect : QuizItem
{
    public List<string> Options { get; set; } = new();
}

