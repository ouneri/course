using CMQuiz.Domain.Entities;

namespace CMQuiz.Application.Interfaces;

public interface IGetQuizUseCase
{
    Task<Quiz?> ExecuteAsync(int quizId);
}

