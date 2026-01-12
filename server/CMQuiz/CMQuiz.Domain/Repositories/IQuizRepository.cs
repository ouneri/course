using CMQuiz.Domain.Entities;

namespace CMQuiz.Domain.Repositories;

public interface IQuizRepository
{
    Task<Quiz?> GetByIdAsync(int id);
    Task<Quiz> CreateAsync(Quiz quiz);
    Task<List<Quiz>> GetAllAsync();
}

