using Microsoft.EntityFrameworkCore;
using TestingPlatform.DAL.Entities;

namespace TestingPlatform.DAL
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<UserEntity> Users => Set<UserEntity>();
        public DbSet<QuizEntity> Quizzes => Set<QuizEntity>();
        public DbSet<QuestionEntity> Questions => Set<QuestionEntity>();
        public DbSet<AttemptEntity> Attempts => Set<AttemptEntity>();
        public DbSet<AnswerAttemptEntity> AnswerAttempts => Set<AnswerAttemptEntity>();
        public DbSet<AnswerOptionEntity> AnswerOptions => Set<AnswerOptionEntity>();
        public DbSet<AnswerAttemptOptionEntity> AnswerAttemptOptions => Set<AnswerAttemptOptionEntity>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // -------------------------
            // User
            // -------------------------
            modelBuilder.Entity<UserEntity>(e =>
            {
                e.HasKey(x => x.Id);

                e.HasIndex(x => x.Email).IsUnique();

                e.HasMany(x => x.Quizes)
                 .WithOne(x => x.Owner)
                 .HasForeignKey(x => x.OwnerId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasMany(x => x.Attempts)
                 .WithOne(x => x.User)
                 .HasForeignKey(x => x.UserId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            // -------------------------
            // Quiz
            // -------------------------
            modelBuilder.Entity<QuizEntity>(e =>
            {
                e.HasKey(x => x.Id);

                e.HasIndex(x => x.SharedCode).IsUnique();

                e.HasMany(x => x.Questions)
                 .WithOne(x => x.Quiz)
                 .HasForeignKey(x => x.QuizId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasMany(x => x.Attempts)
                 .WithOne(x => x.Quiz)
                 .HasForeignKey(x => x.QuizId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            // -------------------------
            // Question
            // -------------------------
            modelBuilder.Entity<QuestionEntity>(e =>
            {
                e.HasKey(x => x.Id);

                e.HasOne(x => x.Quiz)
                 .WithMany(x => x.Questions)
                 .HasForeignKey(x => x.QuizId)
                 .IsRequired()
                 .OnDelete(DeleteBehavior.Cascade);
            });

            // -------------------------
            // AnswerOption
            // -------------------------
            modelBuilder.Entity<AnswerOptionEntity>(e =>
            {
                e.HasKey(x => x.Id);

                e.HasOne(x => x.Question)
                 .WithMany(x => x.AnswerOptions)
                 .HasForeignKey(x => x.QuestionId)
                 .IsRequired()
                 .OnDelete(DeleteBehavior.Cascade);
            });

            // -------------------------
            // Attempt
            // -------------------------
            modelBuilder.Entity<AttemptEntity>(e =>
            {
                e.HasKey(x => x.Id);

                e.HasOne(x => x.Quiz)
                 .WithMany(x => x.Attempts)
                 .HasForeignKey(x => x.QuizId)
                 .IsRequired()
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(x => x.User)
                 .WithMany(x => x.Attempts)
                 .HasForeignKey(x => x.UserId)
                 .IsRequired()
                 .OnDelete(DeleteBehavior.Restrict);

                e.Property(x => x.Status).HasConversion<int>();
            });

            // -------------------------
            // AnswerAttempt
            // -------------------------
            modelBuilder.Entity<AnswerAttemptEntity>(e =>
            {
                e.HasKey(x => x.Id);

                e.HasOne(x => x.Attempt)
                 .WithMany(x => x.AnswerAttempts)
                 .HasForeignKey(x => x.AttemptId)
                 .IsRequired()
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(x => x.Question)
                 .WithMany(x => x.AnswerAttempts)
                 .HasForeignKey(x => x.QuestionId)
                 .IsRequired()
                 .OnDelete(DeleteBehavior.Cascade);
            });

            // -------------------------
            // Many-to-Many: AnswerAttempt <-> AnswerOption через AnswerAttemptOptionEntity
            // -------------------------
            modelBuilder.Entity<AnswerAttemptEntity>()
                .HasMany(a => a.AnswerOptions)
                .WithMany(o => o.AnswerAttempts)
                .UsingEntity<AnswerAttemptOptionEntity>(
                    right => right
                        .HasOne(x => x.AnswerOption)
                        .WithMany()
                        .HasForeignKey(x => x.AnswerOptionId)
                        .OnDelete(DeleteBehavior.Cascade),
                    left => left
                        .HasOne(x => x.AnswerAttempt)
                        .WithMany()
                        .HasForeignKey(x => x.AnswerAttemptId)
                        .OnDelete(DeleteBehavior.Cascade),
                    join =>
                    {
                        join.ToTable("AnswerAttemptOptions");
                        join.HasKey(x => new { x.AnswerAttemptId, x.AnswerOptionId });
                    });
        }
    }
}
