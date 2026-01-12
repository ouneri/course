using CMQuiz.Infrastructure.Services;
using System.Security.Claims;

namespace CMQuiz.Web.API.Middleware;

public class AuthMiddleware(RequestDelegate next, ISessionService sessionService)
{
    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/api/auth") && 
            (context.Request.Method == "POST" && context.Request.Path.Value?.Contains("/login") == true ||
             context.Request.Method == "POST" && context.Request.Path.Value?.Contains("/register") == true))
        {
            await next(context);
            return;
        }

        var sessionId = context.Request.Cookies["sessionId"];
        if (string.IsNullOrEmpty(sessionId))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Unauthorized");
            return;
        }

        var userId = sessionService.GetUserIdBySession(sessionId);
        if (userId == null)
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Unauthorized");
            return;
        }

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId.Value.ToString())
        };
        var identity = new ClaimsIdentity(claims, "cookie");
        context.User = new ClaimsPrincipal(identity);

        await next(context);
    }
}

