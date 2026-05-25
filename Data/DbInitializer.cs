using Microsoft.AspNetCore.Identity;
namespace Vendinha.Data
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();
            var config = serviceProvider.GetRequiredService<IConfiguration>();

            if (!userManager.Users.Any())
            {
                var adminEmail = config["AdminConfig:Email"];
                var adminPassword = config["AdminConfig:Password"];

                if (string.IsNullOrWhiteSpace(adminEmail))
                    throw new InvalidOperationException("AdminConfig:Email não foi configurado.");

                if (string.IsNullOrWhiteSpace(adminPassword))
                    throw new InvalidOperationException("AdminConfig:Password não foi configurado.");

                var adminUser = new IdentityUser
                {
                    UserName = adminEmail,
                    Email = adminEmail
                };

                await userManager.CreateAsync(adminUser, adminPassword);
            }
        }
    }
}