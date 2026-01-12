using CMQuiz.Domain.Entities;
using CMQuiz.Domain.Repositories;

namespace CMQuiz.Infrastructure.Repositories;

public class InMemoryQuizResponseRepository : IQuizResponseRepository
{
    private readonly Dictionary<int, List<QuizResponse>> _responses = new();
    private int _nextId = 1;

    public Task<QuizResponse> CreateAsync(QuizResponse response)
    {
        response.Id = _nextId++;
        
        if (!_responses.ContainsKey(response.QuizId))
        {
            _responses[response.QuizId] = new List<QuizResponse>();
        }
        
        _responses[response.QuizId].Add(response);
        return Task.FromResult(response);
    }

    public Task<List<QuizResponse>> GetByQuizIdAsync(int quizId)
    {
        _responses.TryGetValue(quizId, out var responses);
        return Task.FromResult(responses ?? new List<QuizResponse>());
    }

    public Task<List<QuizResponse>> GetByUserIdAsync(int userId)
    {
        var allResponses = _responses.Values
            .SelectMany(r => r)
            .Where(r => r.UserId == userId)
            .ToList();
        
        return Task.FromResult(allResponses);
    }
}

