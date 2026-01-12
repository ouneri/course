using CMQuiz.Application.Interfaces;
using CMQuiz.Domain.Entities;
using CMQuiz.Domain.Repositories;

namespace CMQuiz.Application.UseCases;

public class GetQuizUseCase : IGetQuizUseCase
{
    private readonly IQuizRepository _quizRepository;

    public GetQuizUseCase(IQuizRepository quizRepository)
    {
        _quizRepository = quizRepository;
    }

    public async Task<Quiz?> ExecuteAsync(int quizId)
    {
        return await _quizRepository.GetByIdAsync(quizId);
    }
}

