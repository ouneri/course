using System.Security.Cryptography;
using System.Text;
using CMQuiz.Application.Interfaces;
using CMQuiz.Application.Requests;
using CMQuiz.Domain.Entities;
using CMQuiz.Domain.Repositories;

namespace CMQuiz.Application.UseCases;

public class RegisterUseCase : IRegisterUseCase
{
    private readonly IUserRepository _userRepository;

    public RegisterUseCase(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<User> ExecuteAsync(RegisterRequest request)
    {
        var existingUser = await _userRepository.GetByUsernameAsync(request.Username);
        if (existingUser != null)
        {
            throw new InvalidOperationException("Username already exists");
        }

        var passwordHash = HashPassword(request.Password);
        
        var user = new User
        {
            Username = request.Username,
            PasswordHash = passwordHash
        };

        return await _userRepository.CreateAsync(user);
    }

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }
}

