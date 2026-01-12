using CMQuiz.Application.Interfaces;
using CMQuiz.Application.Requests;
using CMQuiz.Domain.Entities;
using CMQuiz.Domain.Repositories;

namespace CMQuiz.Application.UseCases;

/// <summary>
/// Use case implementation for creating a new quiz with polymorphic quiz items.
/// </summary>
public class CreateQuizUseCase(IQuizRepository quizRepository) : ICreateQuizUseCase
{
    /// <summary>
    /// Creates a new quiz entity from the request, mapping polymorphic quiz items to their concrete types.
    /// </summary>
    public async Task<Quiz> ExecuteAsync(CreateQuizRequest request)
    {
        var quiz = new Quiz
        {
            Name = request.Name,
            Description = request.Description,
            Items = new List<QuizItem>()
        };

        int itemId = 1;
        foreach (var itemRequest in request.Items)
        {
            QuizItem item = itemRequest switch
            {
                QuizItemRequestSelect select => new QuizItemSelect
                {
                    Id = itemId++,
                    Type = QuizItemType.Select,
                    Options = select.Options.ToList()
                },
                QuizItemRequestText text => new QuizItemText
                {
                    Id = itemId++,
                    Type = QuizItemType.Text,
                    Placeholder = text.Placeholder
                },
                QuizItemRequestRange range => new QuizItemRange
                {
                    Id = itemId++,
                    Type = QuizItemType.Range,
                    Min = range.Min,
                    Max = range.Max
                },
                _ => throw new ArgumentException("Unknown quiz item type")
            };
            
            item.QuizId = 0;
            quiz.Items.Add(item);
        }

        var createdQuiz = await quizRepository.CreateAsync(quiz);
        
        foreach (var item in createdQuiz.Items)
        {
            item.QuizId = createdQuiz.Id;
        }

        return createdQuiz;
    }
}
