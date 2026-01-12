using CMQuiz.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace CMQuiz.Web.API.Filters;

public class AuthorizeFilter(ISessionService sessionService) : IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var sessionId = context.HttpContext.Request.Cookies["sessionId"];
        if (string.IsNullOrEmpty(sessionId))
        {
            context.Result = new UnauthorizedObjectResult(new { message = "Unauthorized" });
            return;
        }

        var userId = sessionService.GetUserIdBySession(sessionId);
        if (userId == null)
        {
            context.Result = new UnauthorizedObjectResult(new { message = "Unauthorized" });
            return;
        }

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId.Value.ToString())
        };
        var identity = new ClaimsIdentity(claims, "cookie");
        context.HttpContext.User = new ClaimsPrincipal(identity);
    }
}

