using CMQuiz.Application.Interfaces;
using CMQuiz.Application.UseCases;
using CMQuiz.Infrastructure;
using CMQuiz.Web.API.Middleware;
using Microsoft.OpenApi.Models;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "CMQuiz API",
        Version = "v1",
        Description = "API для управления квизами"
    });

    // Include XML comments
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }

    // Configure polymorphic types
    c.UseAllOfForInheritance();
    c.UseOneOfForPolymorphism();
});

// Add Infrastructure
builder.Services.AddInfrastructure();

// Add Application Use Cases
builder.Services.AddScoped<ICreateQuizUseCase, CreateQuizUseCase>();
builder.Services.AddScoped<IGetQuizUseCase, GetQuizUseCase>();
builder.Services.AddScoped<ISubmitQuizResponseUseCase, SubmitQuizResponseUseCase>();
builder.Services.AddScoped<ILoginUseCase, LoginUseCase>();
builder.Services.AddScoped<IRegisterUseCase, RegisterUseCase>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "CMQuiz API v1");
    });
}

app.UseCors();

app.UseMiddleware<AuthMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();
