using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using TestingPlatform.DAL.Entities;

namespace TestingPlatform.DAL.Initializer
    {
        public static class DbSeeder
        {
        public static void Seed(this IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var student = new UserEntity
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Vasya",
                Email = "vasya@test.com",
                HashPassword = "123",
                Role = Role.Student
            };

            db.Users.Add(student);
            db.SaveChanges();

            var teacher = new UserEntity
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Teacher",
                Email = "teacher@test.com",
                HashPassword = "123",
                Role = Role.Teacher
            };

            db.Users.Add(teacher);
            db.SaveChanges();


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
            db.SaveChanges();


            var q1 = new QuestionEntity { Id = Guid.NewGuid().ToString(), Text = "2 + 2 = ?", QuizId = quiz.Id, OrderIndex = 1 };
            var q2 = new QuestionEntity { Id = Guid.NewGuid().ToString(), Text = "3 + 3 = ?", QuizId = quiz.Id, OrderIndex = 2 };
            var q3 = new QuestionEntity { Id = Guid.NewGuid().ToString(), Text = "5 - 2 = ?", QuizId = quiz.Id, OrderIndex = 3 };

            db.Questions.AddRange(q1, q2, q3);
            db.SaveChanges();


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
            db.SaveChanges();


            var attempt = new AttemptEntity
            {
                Id = Guid.NewGuid().ToString(),
                QuizId = quiz.Id,
                UserId = student.Id,
                Status = Status.inProgress,
                MaxScore = 3
            };

            db.Attempts.Add(attempt);
            db.SaveChanges();



            var answerAttempt1 = new AnswerAttemptEntity
            {
                Id = Guid.NewGuid().ToString(),
                AttemptId = attempt.Id,
                QuestionId = q1.Id
            };
            var selected1 = options.First(o => o.QuestionId == q1.Id && o.Text == "4");
            answerAttempt1.isCorrect = selected1.isCorrect;
            answerAttempt1.EarnedPoints = selected1.isCorrect ? 1 : 0;
            db.AnswerAttempts.Add(answerAttempt1);
            db.Set<AnswerAttemptOptionEntity>().Add(new AnswerAttemptOptionEntity
            {
                AnswerAttemptId = answerAttempt1.Id,
                AnswerOptionId = selected1.Id
            });

            // Q2
            var answerAttempt2 = new AnswerAttemptEntity
            {
                Id = Guid.NewGuid().ToString(),
                AttemptId = attempt.Id,
                QuestionId = q2.Id
            };
            var selected2 = options.First(o => o.QuestionId == q2.Id && o.Text == "7");
            answerAttempt2.isCorrect = selected2.isCorrect;
            answerAttempt2.EarnedPoints = selected2.isCorrect ? 1 : 0;
            db.AnswerAttempts.Add(answerAttempt2);
            db.Set<AnswerAttemptOptionEntity>().Add(new AnswerAttemptOptionEntity
            {
                AnswerAttemptId = answerAttempt2.Id,
                AnswerOptionId = selected2.Id
            });

            // Q3
            var answerAttempt3 = new AnswerAttemptEntity
            {
                Id = Guid.NewGuid().ToString(),
                AttemptId = attempt.Id,
                QuestionId = q3.Id
            };
            var selected3 = options.First(o => o.QuestionId == q3.Id && o.Text == "3");
            answerAttempt3.isCorrect = selected3.isCorrect;
            answerAttempt3.EarnedPoints = selected3.isCorrect ? 1 : 0;
            db.AnswerAttempts.Add(answerAttempt3);
            db.Set<AnswerAttemptOptionEntity>().Add(new AnswerAttemptOptionEntity
            {
                AnswerAttemptId = answerAttempt3.Id,
                AnswerOptionId = selected3.Id
            });

            db.SaveChanges();


            attempt.Score = db.AnswerAttempts
                .Where(a => a.AttemptId == attempt.Id)
                .Sum(a => a.EarnedPoints);

            db.SaveChanges();

        }

        }
    }
