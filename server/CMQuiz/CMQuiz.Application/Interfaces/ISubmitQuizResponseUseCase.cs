using CMQuiz.Application.Requests;
using CMQuiz.Domain.Entities;

namespace CMQuiz.Application.Interfaces;

public interface ISubmitQuizResponseUseCase
{
    Task<QuizResponse> ExecuteAsync(QuizResponseRequest request, int userId);
}

