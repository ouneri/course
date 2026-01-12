using CMQuiz.Application.Interfaces;
using CMQuiz.Application.Requests;
using CMQuiz.Domain.Entities;
using CMQuiz.Domain.Repositories;

namespace CMQuiz.Application.UseCases;

public class CreateQuizUseCase : ICreateQuizUseCase
{
    private readonly IQuizRepository _quizRepository;

    public CreateQuizUseCase(IQuizRepository quizRepository)
    {
        _quizRepository = quizRepository;
    }

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
                    Options = select.Options
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
            
            item.QuizId = 0; // Will be set after quiz is created
            quiz.Items.Add(item);
        }

        var createdQuiz = await _quizRepository.CreateAsync(quiz);
        
        // Update QuizId for all items
        foreach (var item in createdQuiz.Items)
        {
            item.QuizId = createdQuiz.Id;
        }

        return createdQuiz;
    }
}

