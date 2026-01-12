namespace CMQuiz.Web.API.Models;

public class QuizItemModel
{
    public int Id { get; set; }
    public int QuizId { get; set; }
    public string Type { get; set; } = string.Empty;
    
    // For Select
    public List<string>? Options { get; set; }
    
    // For Text
    public string? Placeholder { get; set; }
    
    // For Range
    public int? Min { get; set; }
    public int? Max { get; set; }
}

