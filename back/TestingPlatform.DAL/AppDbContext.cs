using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TestingPlatform.DAL.Entities;
using TestingPlatform.DAL.Entities.Identity;

namespace TestingPlatform.DAL
{
    public class AppDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string,
        ApplicationUserClaim, ApplicationUserRole, ApplicationUserLogin,
        ApplicationRoleClaim, ApplicationUserToken>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<UserEntity> Users => Set<UserEntity>();
        public DbSet<QuizEntity> Quizzes => Set<QuizEntity>();
        public DbSet<CommentsEntity> Comments => Set<CommentsEntity>();
        public DbSet<QuestionEntity> Questions => Set<QuestionEntity>();
        public DbSet<AttemptEntity> Attempts => Set<AttemptEntity>();
        public DbSet<AnswerAttemptEntity> AnswerAttempts => Set<AnswerAttemptEntity>();
        public DbSet<AnswerOptionEntity> AnswerOptions => Set<AnswerOptionEntity>();
        public DbSet<AnswerAttemptOptionEntity> AnswerAttemptOptions => Set<AnswerAttemptOptionEntity>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // -------------------------
            // UserEntity
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

                e.HasMany(x => x.Comments)
                 .WithOne(x => x.User)
                 .HasForeignKey(x => x.UserId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            // -------------------------
            // QuizEntity
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

                e.HasMany(x => x.Comments)
                 .WithOne(x => x.Quiz)
                 .HasForeignKey(x => x.QuizId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            // -------------------------
            // QuestionEntity
            // -------------------------
            modelBuilder.Entity<QuestionEntity>(e =>
            {
                e.HasKey(x => x.Id);

                e.HasOne(x => x.Quiz)
                 .WithMany(x => x.Questions)
                 .HasForeignKey(x => x.QuizId)
                 .IsRequired()
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasMany(x => x.AnswerOptions)
                 .WithOne(x => x.Question)
                 .HasForeignKey(x => x.QuestionId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            // -------------------------
            // AttemptEntity
            // -------------------------
            modelBuilder.Entity<AttemptEntity>(e =>
            {
                e.HasKey(x => x.Id);

                e.HasOne(x => x.User)
                 .WithMany(x => x.Attempts)
                 .HasForeignKey(x => x.UserId)
                 .IsRequired()
                 .OnDelete(DeleteBehavior.Restrict);

                e.HasOne(x => x.Quiz)
                 .WithMany(x => x.Attempts)
                 .HasForeignKey(x => x.QuizId)
                 .IsRequired()
                 .OnDelete(DeleteBehavior.Cascade);

                e.Property(x => x.Status).HasConversion<int>();
            });

            // -------------------------
            // AnswerAttemptEntity
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

                e.HasMany(a => a.AnswerOptions)
                 .WithMany(o => o.AnswerAttempts)
                 .UsingEntity<AnswerAttemptOptionEntity>(
                    j => j
                        .HasOne(x => x.AnswerOption)
                        .WithMany()
                        .HasForeignKey(x => x.AnswerOptionId)
                        .OnDelete(DeleteBehavior.Cascade),
                    j => j
                        .HasOne(x => x.AnswerAttempt)
                        .WithMany()
                        .HasForeignKey(x => x.AnswerAttemptId)
                        .OnDelete(DeleteBehavior.Cascade),
                    j =>
                    {
                        j.ToTable("AnswerAttemptOptions");
                        j.HasKey(x => new { x.AnswerAttemptId, x.AnswerOptionId });
                    });
            });

            // -------------------------
            // CommentsEntity
            // -------------------------
            modelBuilder.Entity<CommentsEntity>(e =>
            {
                e.HasKey(x => x.Id);

                e.HasOne(x => x.User)
                 .WithMany(x => x.Comments)
                 .HasForeignKey(x => x.UserId)
                 .IsRequired()
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(x => x.Quiz)
                 .WithMany(x => x.Comments)
                 .HasForeignKey(x => x.QuizId)
                 .IsRequired()
                 .OnDelete(DeleteBehavior.Restrict);
            });

            // -------------------------
            // Identity (ApplicationUser/ApplicationRole)
            // -------------------------
            modelBuilder.Entity<ApplicationUser>(b =>
            {
                // Claims
                b.HasMany(u => u.Claims)
                 .WithOne(c => c.User)           
                 .HasForeignKey(c => c.UserId)   
                 .IsRequired();

                // Logins
                b.HasMany(u => u.Logins)
                 .WithOne(l => l.User)
                 .HasForeignKey(l => l.UserId)
                 .IsRequired();

                // Tokens
                b.HasMany(u => u.Tokens)
                 .WithOne(t => t.User)
                 .HasForeignKey(t => t.UserId)
                 .IsRequired();

                // UserRoles
                b.HasMany(u => u.UserRoles)
                 .WithOne(ur => ur.User)
                 .HasForeignKey(ur => ur.UserId)
                 .IsRequired();
            });

            modelBuilder.Entity<ApplicationRole>(b =>
            {
                // RoleClaims
                b.HasMany(r => r.RoleClaims)
                 .WithOne(rc => rc.Role)
                 .HasForeignKey(rc => rc.RoleId)
                 .IsRequired();

                // UserRoles
                b.HasMany(r => r.UserRoles)
                 .WithOne(ur => ur.Role)
                 .HasForeignKey(ur => ur.RoleId)
                 .IsRequired();
            });
        }
    }
}