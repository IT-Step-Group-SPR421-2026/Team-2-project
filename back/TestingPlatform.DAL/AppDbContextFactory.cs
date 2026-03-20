using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace TestingPlatform.DAL
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();

            optionsBuilder.UseNpgsql(
                "Host=caboose.proxy.rlwy.net;Port=12478;Database=railway;Username=postgres;Password=PHrLPIYlCGteVhDqzhKMyndPTGtiunoT;SSL Mode=Require;Trust Server Certificate=true;"
            );

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}