using CMQuiz.Domain.Entities;
using CMQuiz.Domain.Repositories;

namespace CMQuiz.Infrastructure.Repositories;

public class InMemoryQuizRepository : IQuizRepository
{
    private readonly Dictionary<int, Quiz> _quizzes = new();
    private int _nextId = 1;

    public Task<Quiz?> GetByIdAsync(int id)
    {
        _quizzes.TryGetValue(id, out var quiz);
        return Task.FromResult(quiz);
    }

    public Task<Quiz> CreateAsync(Quiz quiz)
    {
        quiz.Id = _nextId++;
        _quizzes[quiz.Id] = quiz;
        return Task.FromResult(quiz);
    }

    public Task<List<Quiz>> GetAllAsync()
    {
        return Task.FromResult(_quizzes.Values.ToList());
    }
}

