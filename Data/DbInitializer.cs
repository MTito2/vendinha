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