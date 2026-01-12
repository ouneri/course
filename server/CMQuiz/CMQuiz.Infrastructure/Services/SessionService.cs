namespace CMQuiz.Infrastructure.Services;

public interface ISessionService
{
    string CreateSession(int userId);
    int? GetUserIdBySession(string sessionId);
    void RemoveSession(string sessionId);
}

public class SessionService : ISessionService
{
    private readonly Dictionary<string, int> _sessions = new();

    public string CreateSession(int userId)
    {
        var sessionId = Guid.NewGuid().ToString();
        _sessions[sessionId] = userId;
        return sessionId;
    }

    public int? GetUserIdBySession(string sessionId)
    {
        _sessions.TryGetValue(sessionId, out var userId);
        return userId;
    }

    public void RemoveSession(string sessionId)
    {
        _sessions.Remove(sessionId);
    }
}

