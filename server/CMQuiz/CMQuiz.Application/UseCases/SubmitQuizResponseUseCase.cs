using CMQuiz.Application.Interfaces;
using CMQuiz.Application.Requests;
using CMQuiz.Domain.Entities;
using CMQuiz.Domain.Repositories;

namespace CMQuiz.Application.UseCases;

public class SubmitQuizResponseUseCase : ISubmitQuizResponseUseCase
{
    private readonly IQuizResponseRepository _responseRepository;
    private readonly IQuizRepository _quizRepository;

    public SubmitQuizResponseUseCase(
        IQuizResponseRepository responseRepository,
        IQuizRepository quizRepository)
    {
        _responseRepository = responseRepository;
        _quizRepository = quizRepository;
    }

    public async Task<QuizResponse> ExecuteAsync(QuizResponseRequest request, int userId)
    {
        // Validate that quiz exists
        var quiz = await _quizRepository.GetByIdAsync(request.QuizId);
        if (quiz == null)
        {
            throw new ArgumentException("Quiz not found");
        }

        // Validate that all item IDs exist in the quiz
        var itemIds = quiz.Items.Select(i => i.Id).ToHashSet();
        foreach (var answerKey in request.Answers.Keys)
        {
            if (!itemIds.Contains(answerKey))
            {
                throw new ArgumentException($"Quiz item with id {answerKey} not found in quiz");
            }
        }

        var response = new QuizResponse
        {
            QuizId = request.QuizId,
            UserId = userId,
            Answers = request.Answers
        };

        return await _responseRepository.CreateAsync(response);
    }
}

