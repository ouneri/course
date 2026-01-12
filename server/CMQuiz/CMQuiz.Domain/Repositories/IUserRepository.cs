using CMQuiz.Domain.Entities;

namespace CMQuiz.Domain.Repositories;

public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username);
    Task<User> CreateAsync(User user);
    Task<User?> GetByIdAsync(int id);
}

