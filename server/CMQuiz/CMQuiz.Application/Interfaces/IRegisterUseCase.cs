using CMQuiz.Application.Requests;
using CMQuiz.Domain.Entities;

namespace CMQuiz.Application.Interfaces;

public interface IRegisterUseCase
{
    Task<User> ExecuteAsync(RegisterRequest request);
}

