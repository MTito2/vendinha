using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Vendinha.Models;

namespace Vendinha.Routes
{
    public static class LoginRoute
    {
        public static void LoginRoutes(this WebApplication app)
        {
            var route = app.MapGroup("api/auth");

            route.MapPost("/register", async (UserManager<IdentityUser> userManager, LoginRequest model) =>
            {
                var user = new IdentityUser { UserName = model.Email, Email = model.Email };
                var result = await userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    return Results.Ok(new { mensagem = "Usuário criado com sucesso!" });
                }

                return Results.BadRequest(result.Errors);
            }).RequireAuthorization();

            route.MapPost("/login", async (UserManager<IdentityUser> userManager, IConfiguration config, LoginRequest model) =>
            {
                var user = await userManager.FindByEmailAsync(model.Email);

                if (user is null || !await userManager.CheckPasswordAsync(user, model.Password))
                {
                    return Results.Unauthorized();
                }

                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(config["Jwt:Key"]!);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, user.Id),
                        new Claim(ClaimTypes.Email, user.Email!)
                    }),
                    Expires = DateTime.UtcNow.AddHours(2),
                    Issuer = config["Jwt:Issuer"],
                    Audience = config["Jwt:Audience"],
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                return Results.Ok(new { token = tokenString });
            });
        }
    }
}