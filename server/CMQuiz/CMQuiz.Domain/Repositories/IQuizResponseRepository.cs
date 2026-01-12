using CMQuiz.Domain.Entities;

namespace CMQuiz.Domain.Repositories;

public interface IQuizResponseRepository
{
    Task<QuizResponse> CreateAsync(QuizResponse response);
    Task<List<QuizResponse>> GetByQuizIdAsync(int quizId);
    Task<List<QuizResponse>> GetByUserIdAsync(int userId);
}

