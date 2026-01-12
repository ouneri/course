using CMQuiz.Application.Requests;

namespace CMQuiz.Application.Interfaces;

public interface ILoginUseCase
{
    Task<string?> ExecuteAsync(LoginRequest request); // Returns sessionId or null
}

