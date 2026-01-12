using CMQuiz.Application.Requests;
using CMQuiz.Domain.Entities;

namespace CMQuiz.Application.Interfaces;

public interface ICreateQuizUseCase
{
    Task<Quiz> ExecuteAsync(CreateQuizRequest request);
}

