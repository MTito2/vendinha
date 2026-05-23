using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Vendinha.Models;

namespace Vendinha.Routes
{
    public static class LoginRoute
    {
        public static void LoginRoutes(this WebApplication app)
        {
            var route = app.MapGroup("api/auth");

            route.MapPost("/login", async (UserManager<IdentityUser> userManager, IConfiguration config, HttpContext context, LoginRequest model) =>
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
                    Expires = DateTime.UtcNow.AddHours(4),
                    Issuer = config["Jwt:Issuer"],
                    Audience = config["Jwt:Audience"],
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,   
                    SameSite = SameSiteMode.None, 
                    Expires = DateTime.UtcNow.AddHours(4) 
                };

                context.Response.Cookies.Append("jwt_token", tokenString, cookieOptions);

                return Results.Ok(new { mensagem = "Login realizado com sucesso!" });
            });

            route.MapPost("/logout", (HttpContext context) =>
            {
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None
                };

                context.Response.Cookies.Delete("jwt_token", cookieOptions);

                return Results.Ok(new { mensagem = "Logout realizado com sucesso!" });

            }).RequireAuthorization();

            route.MapGet("/users", (UserManager<IdentityUser> userManager) =>
            {
                var users = userManager.Users
                    .Select(u => new
                    {
                        id = u.Id,
                        email = u.Email,
                        userName = u.UserName
                    })
                    .ToList();

                return Results.Ok(users);
            }).RequireAuthorization();

            route.MapPatch("/users/{id}", async (string id, UserManager<IdentityUser> userManager, UpdateUserRequest req) =>
            {

                var user = await userManager.FindByIdAsync(id);
                if (user is null)
                {
                    return Results.NotFound(new { mensagem = "Usuário não encontrado." });
                }

                if (!string.IsNullOrWhiteSpace(req.Email))
                {
                    var emailResult = await userManager.SetEmailAsync(user, req.Email);
                    var userResult = await userManager.SetUserNameAsync(user, req.Email);

                    if (!emailResult.Succeeded || !userResult.Succeeded)
                    {
                        return Results.BadRequest(new { mensagem = "Erro ao atualizar o e-mail." });
                    }
                }

                if (!string.IsNullOrWhiteSpace(req.Password))
                {
                    var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);
                    var passResult = await userManager.ResetPasswordAsync(user, resetToken, req.Password);

                    if (!passResult.Succeeded)
                    {
                        return Results.BadRequest(passResult.Errors);
                    }
                }

                return Results.Ok(new { mensagem = "Dados do usuário atualizados com sucesso!" });

            }).RequireAuthorization();

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

            route.MapGet("/me", (ClaimsPrincipal user) =>
            {
                var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userEmail = user.FindFirst(ClaimTypes.Email)?.Value;

                return Results.Ok(new
                {
                    id = userId,
                    email = userEmail,
                    mensagem = "Usuário está autenticado!"
                });
            }).RequireAuthorization();
        }
    }
}