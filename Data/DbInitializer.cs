using Microsoft.AspNetCore.Identity;

namespace Vendinha.Data
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();
            // 1. Injetamos o RoleManager para lidar com os perfis
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var config = serviceProvider.GetRequiredService<IConfiguration>();

            // 2. Garantimos que a Role "Admin" exista no banco de dados antes de tentar usá-la
            if (!await roleManager.RoleExistsAsync("Admin"))
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
            }

            // Verifica se não há usuários no banco
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

                // Cria o usuário
                var result = await userManager.CreateAsync(adminUser, adminPassword);

                // 3. Se o usuário foi criado com sucesso, adicionamos ele à Role "Admin"
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }
        }
    }
}