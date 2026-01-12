using CMQuiz.Application.Interfaces;
using CMQuiz.Application.Requests;
using CMQuiz.Infrastructure.Services;
using CMQuiz.Web.API.Mappers;
using CMQuiz.Web.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace CMQuiz.Web.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    ILoginUseCase loginUseCase,
    IRegisterUseCase registerUseCase,
    ISessionService sessionService)
    : ControllerBase
{
    /// <summary>
    /// Войти в систему
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestModel model)
    {
        var request = QuizMapper.ToLoginRequest(model);
        var sessionId = await loginUseCase.ExecuteAsync(request);
        
        if (sessionId == null)
        {
            return Unauthorized(new { message = "Invalid username or password" });
        }

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            SameSite = SameSiteMode.Strict,
            Secure = false, // Set to true in production with HTTPS
            Expires = DateTimeOffset.UtcNow.AddDays(7)
        };

        Response.Cookies.Append("sessionId", sessionId, cookieOptions);
        
        return Ok(new { message = "Login successful" });
    }

    /// <summary>
    /// Зарегистрировать нового пользователя
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestModel model)
    {
        try
        {
            var request = QuizMapper.ToRegisterRequest(model);
            var user = await registerUseCase.ExecuteAsync(request);
            
            return Ok(new { id = user.Id, username = user.Username });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Выйти из системы
    /// </summary>
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        var sessionId = Request.Cookies["sessionId"];
        if (!string.IsNullOrEmpty(sessionId))
        {
            sessionService.RemoveSession(sessionId);
        }

        Response.Cookies.Delete("sessionId");
        return Ok(new { message = "Logout successful" });
    }

    /// <summary>
    /// Проверить текущего пользователя
    /// </summary>
    [HttpGet("me")]
    public IActionResult GetMe()
    {
        var sessionId = Request.Cookies["sessionId"];
        if (string.IsNullOrEmpty(sessionId))
        {
            return Unauthorized();
        }

        var userId = sessionService.GetUserIdBySession(sessionId);
        if (userId == null)
        {
            return Unauthorized();
        }

        return Ok(new { userId = userId.Value });
    }
}

