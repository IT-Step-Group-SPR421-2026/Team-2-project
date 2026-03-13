using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using TestingPlatform.BLL.Services.AnswerAttempt;
using TestingPlatform.BLL.Services.AnswerOption;
using TestingPlatform.BLL.Services.Attempt;
using TestingPlatform.BLL.Services.Auth;
using TestingPlatform.BLL.Services.Comments;
using TestingPlatform.BLL.Services.Crystal;
using TestingPlatform.BLL.Services.Question;
using TestingPlatform.BLL.Services.Quiz;
using TestingPlatform.BLL.Services.Storage;
using TestingPlatform.BLL.Services.Translation;
using TestingPlatform.DAL;
using TestingPlatform.DAL.Entities.Identity;
using TestingPlatform.DAL.Initializer;
using TestingPlatform.DAL.Repositories.AnswerOption;
using TestingPlatform.DAL.Repositories.Attempt;
using TestingPlatform.DAL.Repositories.Comments;
using TestingPlatform.DAL.Repositories.Question;
using TestingPlatform.DAL.Repositories.Quiz;
using TestingPlatform.DAL.Repositories.User;
using TestingPlatform.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



builder.Services.AddAutoMapper(options =>
{
    options.LicenseKey = builder.Configuration["Automapper:LicenseKey"];
}, AppDomain.CurrentDomain.GetAssemblies());


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultDb"))
);

// Add repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IQuizRepository, QuizRepository>();
builder.Services.AddScoped<IQuestionRepository, QuestionRepository>();
builder.Services.AddScoped<IAttemptRepository, AttemptRepository>();
builder.Services.AddScoped<IAnswerAttemptRepository, AnswerAttemptRepository>();
builder.Services.AddScoped<IAnswerOptionRepository, AnswerOptionRepository>();
builder.Services.AddScoped<ICommentsRepository, CommentsRepository>();

// Add Services
builder.Services.AddScoped<IStorageServise, StorageServise>();
builder.Services.AddScoped<IAnswerAttemptService, AnswerAttemptService>();
builder.Services.AddScoped<IAnswerOptionService, AnswerOptionService>();
builder.Services.AddScoped<IQuizService, QuizService>();
builder.Services.AddScoped<IQuestionService, QuestionService>();
builder.Services.AddScoped<IAttemptService, AttemptService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddHttpClient<ITranslationService, TranslationService>();
builder.Services.AddScoped<ICommentsRepository, CommentsRepository>();
builder.Services.AddScoped<ICommentsService, CommentsService>();
builder.Services.AddScoped<ICrystalService, CrystalService>();

builder.Services.AddAutoMapper(options =>
{
    options.LicenseKey = builder.Configuration["Automapper:LicenseKey"];
}, AppDomain.CurrentDomain.GetAssemblies());


builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendCorsPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


var app = builder.Build();




if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("FrontendCorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.AddStaticFiles(app.Environment);
app.MapControllers();



app.Seed();

app.Run();
