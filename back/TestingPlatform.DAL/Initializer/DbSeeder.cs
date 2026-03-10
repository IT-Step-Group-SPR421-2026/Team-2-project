using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestingPlatform.DAL.Entities;
using TestingPlatform.DAL.Entities.Identity;
using TestingPlatform.DAL.Repositories.User;

namespace TestingPlatform.DAL.Initializer
{
    public static class DbSeeder
    {
        public static async Task Seed(this IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
            var repositoryUser = scope.ServiceProvider.GetRequiredService<IUserRepository>();


            var c = repositoryUser.Users.Count() - 1;
            if (repositoryUser.Users.Count() <= 0)
            {

                // ---- Roles Identity ----
                var roles = new[] { "Student", "Teacher", "Admin" };
                foreach (var role in roles)
                {
                    if (!await roleManager.RoleExistsAsync(role))
                        await roleManager.CreateAsync(new ApplicationRole { Name = role });
                }

                // ---- Users Identity + UserEntity ----
                async Task<UserEntity> CreateUserAsync(string email, string name, Role role, string password)
                {
                    var identityUser = await userManager.FindByEmailAsync(email);
                    if (identityUser == null)
                    {
                        identityUser = new ApplicationUser
                        {
                            UserName = name,
                            Email = email,
                            Name = name,
                            EmailConfirmed = true
                        };
                        await userManager.CreateAsync(identityUser, password);
                        await userManager.AddToRoleAsync(identityUser, role.ToString());
                    }


                    var existingUserEntity = repositoryUser.Users.FirstOrDefault(u => u.Email == email);
                    if (existingUserEntity == null)
                    {
                        var userEntity = new UserEntity
                        {
                            Id = identityUser.Id,
                            Name = name,
                            Email = email,
                            HashPassword = password,
                            Role = role
                        };
                        await repositoryUser.CreateAsync(userEntity);
                        return userEntity;
                    }

                    return existingUserEntity;
                }

                var admin = await CreateUserAsync("admin@test.com", "Administrator", Role.Admin, "Admin123!");
                var student = await CreateUserAsync("student@test.com", "Vasya Student", Role.Student, "Student123!");
                var teacher = await CreateUserAsync("teacher@test.com", "Teacher", Role.Teacher, "Teacher123!");

                await db.SaveChangesAsync();

                // ---- Quiz / Questions / Options / Attempts / Comments ----
                if (!db.Quizzes.Any())
                {
                    var quiz = new QuizEntity
                    {
                        Id = Guid.NewGuid().ToString(),
                        Title = "Math Test",
                        Description = "Test with 3 questions",
                        isPublic = true,
                        SharedCode = "ABC123",
                        OwnerId = teacher.Id
                    };
                    db.Quizzes.Add(quiz);
                    await db.SaveChangesAsync();

                    var q1 = new QuestionEntity { Id = Guid.NewGuid().ToString(), Text = "2 + 2 = ?", QuizId = quiz.Id, OrderIndex = 1 };
                    var q2 = new QuestionEntity { Id = Guid.NewGuid().ToString(), Text = "3 + 3 = ?", QuizId = quiz.Id, OrderIndex = 2 };
                    var q3 = new QuestionEntity { Id = Guid.NewGuid().ToString(), Text = "5 - 2 = ?", QuizId = quiz.Id, OrderIndex = 3 };
                    db.Questions.AddRange(q1, q2, q3);
                    await db.SaveChangesAsync();

                    var options = new List<AnswerOptionEntity>
                {
                    new AnswerOptionEntity { Id = Guid.NewGuid().ToString(), Text = "3", isCorrect = false, QuestionId = q1.Id, OrderIndex = 1 },
                    new AnswerOptionEntity { Id = Guid.NewGuid().ToString(), Text = "4", isCorrect = true, QuestionId = q1.Id, OrderIndex = 2 },
                    new AnswerOptionEntity { Id = Guid.NewGuid().ToString(), Text = "5", isCorrect = false, QuestionId = q1.Id, OrderIndex = 3 },

                    new AnswerOptionEntity { Id = Guid.NewGuid().ToString(), Text = "5", isCorrect = false, QuestionId = q2.Id, OrderIndex = 1 },
                    new AnswerOptionEntity { Id = Guid.NewGuid().ToString(), Text = "6", isCorrect = true, QuestionId = q2.Id, OrderIndex = 2 },
                    new AnswerOptionEntity { Id = Guid.NewGuid().ToString(), Text = "7", isCorrect = false, QuestionId = q2.Id, OrderIndex = 3 },

                    new AnswerOptionEntity { Id = Guid.NewGuid().ToString(), Text = "2", isCorrect = false, QuestionId = q3.Id, OrderIndex = 1 },
                    new AnswerOptionEntity { Id = Guid.NewGuid().ToString(), Text = "3", isCorrect = true, QuestionId = q3.Id, OrderIndex = 2 },
                    new AnswerOptionEntity { Id = Guid.NewGuid().ToString(), Text = "4", isCorrect = false, QuestionId = q3.Id, OrderIndex = 3 }
                };
                    db.AnswerOptions.AddRange(options);
                    await db.SaveChangesAsync();

                    // ---- Attempt ----
                    var attempt = new AttemptEntity
                    {
                        Id = Guid.NewGuid().ToString(),
                        QuizId = quiz.Id,
                        UserId = student.Id,
                        Status = Status.inProgress,
                        MaxScore = 3
                    };
                    db.Attempts.Add(attempt);
                    await db.SaveChangesAsync();

                    // ---- AnswerAttempts ----
                    var answerAttempt1 = new AnswerAttemptEntity
                    {
                        Id = Guid.NewGuid().ToString(),
                        AttemptId = attempt.Id,
                        QuestionId = q1.Id,
                        isCorrect = options.First(o => o.QuestionId == q1.Id && o.Text == "4").isCorrect,
                        EarnedPoints = options.First(o => o.QuestionId == q1.Id && o.Text == "4").isCorrect ? 1 : 0
                    };
                    db.AnswerAttempts.Add(answerAttempt1);

                    var answerAttempt2 = new AnswerAttemptEntity
                    {
                        Id = Guid.NewGuid().ToString(),
                        AttemptId = attempt.Id,
                        QuestionId = q2.Id,
                        isCorrect = options.First(o => o.QuestionId == q2.Id && o.Text == "7").isCorrect,
                        EarnedPoints = options.First(o => o.QuestionId == q2.Id && o.Text == "7").isCorrect ? 1 : 0
                    };
                    db.AnswerAttempts.Add(answerAttempt2);

                    var answerAttempt3 = new AnswerAttemptEntity
                    {
                        Id = Guid.NewGuid().ToString(),
                        AttemptId = attempt.Id,
                        QuestionId = q3.Id,
                        isCorrect = options.First(o => o.QuestionId == q3.Id && o.Text == "3").isCorrect,
                        EarnedPoints = options.First(o => o.QuestionId == q3.Id && o.Text == "3").isCorrect ? 1 : 0
                    };
                    db.AnswerAttempts.Add(answerAttempt3);
                    await db.SaveChangesAsync();

                    // ---- Comments ----
                    var comments = new List<CommentsEntity>
                {
                    new CommentsEntity
                    {
                        Id = Guid.NewGuid().ToString(),
                        QuizId = quiz.Id,
                        UserId = student.Id,
                        Text = "Цей тест був дуже легкий!",
                        CreatedDate = DateTime.UtcNow
                    },
                    new CommentsEntity
                    {
                        Id = Guid.NewGuid().ToString(),
                        QuizId = quiz.Id,
                        UserId = teacher.Id,
                        Text = "Дякую за проходження тесту!",
                        CreatedDate = DateTime.UtcNow
                    }
                };
                    db.Comments.AddRange(comments);
                    await db.SaveChangesAsync();
                }
            }
        }
    }
}