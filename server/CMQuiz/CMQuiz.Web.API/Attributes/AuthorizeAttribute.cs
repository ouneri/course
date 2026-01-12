using CMQuiz.Web.API.Filters;
using Microsoft.AspNetCore.Mvc;

namespace CMQuiz.Web.API.Attributes;

public class AuthorizeAttribute : ServiceFilterAttribute
{
    public AuthorizeAttribute() : base(typeof(AuthorizeFilter))
    {
    }
}

