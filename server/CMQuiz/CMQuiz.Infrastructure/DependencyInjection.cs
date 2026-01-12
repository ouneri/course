using CMQuiz.Domain.Repositories;
using CMQuiz.Infrastructure.Repositories;
using CMQuiz.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CMQuiz.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddSingleton<IQuizRepository, InMemoryQuizRepository>();
        services.AddSingleton<IQuizResponseRepository, InMemoryQuizResponseRepository>();
        services.AddSingleton<IUserRepository, InMemoryUserRepository>();
        services.AddSingleton<ISessionService, SessionService>();
        
        return services;
    }
}

