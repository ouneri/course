using CMQuiz.Domain.Entities;
using CMQuiz.Domain.Repositories;

namespace CMQuiz.Infrastructure.Repositories;

public class InMemoryUserRepository : IUserRepository
{
    private readonly Dictionary<string, User> _usersByUsername = new();
    private readonly Dictionary<int, User> _usersById = new();
    private int _nextId = 1;

    public Task<User?> GetByUsernameAsync(string username)
    {
        _usersByUsername.TryGetValue(username, out var user);
        return Task.FromResult(user);
    }

    public Task<User> CreateAsync(User user)
    {
        user.Id = _nextId++;
        _usersByUsername[user.Username] = user;
        _usersById[user.Id] = user;
        return Task.FromResult(user);
    }

    public Task<User?> GetByIdAsync(int id)
    {
        _usersById.TryGetValue(id, out var user);
        return Task.FromResult(user);
    }
}

