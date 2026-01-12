using System.Security.Cryptography;
using System.Text;
using CMQuiz.Application.Interfaces;
using CMQuiz.Application.Requests;
using CMQuiz.Domain.Repositories;
using CMQuiz.Infrastructure.Services;

namespace CMQuiz.Application.UseCases;

public class LoginUseCase : ILoginUseCase
{
    private readonly IUserRepository _userRepository;
    private readonly ISessionService _sessionService;

    public LoginUseCase(IUserRepository userRepository, ISessionService sessionService)
    {
        _userRepository = userRepository;
        _sessionService = sessionService;
    }

    public async Task<string?> ExecuteAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByUsernameAsync(request.Username);
        if (user == null)
        {
            return null;
        }

        var passwordHash = HashPassword(request.Password);
        if (passwordHash != user.PasswordHash)
        {
            return null;
        }

        var sessionId = _sessionService.CreateSession(user.Id);
        return sessionId;
    }

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }
}

