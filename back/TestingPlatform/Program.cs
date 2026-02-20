using Microsoft.EntityFrameworkCore;
using System;
using TestingPlatform.BLL.Services.Question;
using TestingPlatform.BLL.Services.Quiz;
using TestingPlatform.DAL;
using TestingPlatform.DAL.Initializer;
using TestingPlatform.DAL.Repositories.Attempt;
using TestingPlatform.DAL.Repositories.Question;
using TestingPlatform.DAL.Repositories.Quiz;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultDb"))
);

// Add repositories
builder.Services.AddScoped<IQuizRepository, QuizRepository>();
builder.Services.AddScoped<IQuestionRepository, QuestionRepository>();
builder.Services.AddScoped<IAttemptRepository, AttemptRepository>();

// Add Services
builder.Services.AddScoped<IQuizService, QuizService>();
builder.Services.AddScoped<IQuestionService, QuestionService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();
app.MapControllers();



app.Seed();

app.Run();
