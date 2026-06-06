using Microsoft.AspNetCore.Authorization;
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

            // ==========================================
            // ENDPOINT: LOGIN
            // ==========================================
            route.MapPost("/login", async (UserManager<IdentityUser> userManager, IConfiguration config, HttpContext context, LoginRequest model) =>
            {
                var user = await userManager.FindByEmailAsync(model.Email);

                if (user is null || !await userManager.CheckPasswordAsync(user, model.Password))
                {
                    return Results.Unauthorized();
                }

                var roles = await userManager.GetRolesAsync(user);

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Email, user.Email!),
                    new Claim(ClaimTypes.Name, user.UserName!)
                };

                foreach (var role in roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }

                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(config["Jwt:Key"]!);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
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

            // ==========================================
            // ENDPOINT: LOGOUT
            // ==========================================
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

            // ==========================================
            // ENDPOINT: LISTAR USUÁRIOS
            // ==========================================
            route.MapGet("/users", async (UserManager<IdentityUser> userManager) =>
            {
                var admins = await userManager.GetUsersInRoleAsync("Admin");
                var adminIds = admins.Select(a => a.Id).ToHashSet();

                var users = userManager.Users
                    .ToList()
                    .Select(u => new
                    {
                        id = u.Id,
                        email = u.Email,
                        userName = u.UserName,
                        isAdmin = adminIds.Contains(u.Id)
                    })
                    .ToList();

                return Results.Ok(users);

            }).RequireAuthorization();

            // ==========================================
            // ENDPOINT: ATUALIZAR USUÁRIO (PATCH)
            // ==========================================
            route.MapPatch("/users/{id}", async (string id, UserManager<IdentityUser> userManager, UpdateUserRequest req) =>
            {
                var user = await userManager.FindByIdAsync(id);

                if (user is null)
                {
                    return Results.NotFound(new { mensagem = "Usuário não encontrado." });
                }

                // 1. Validação Antecipada e Atualização de E-mail
                if (!string.IsNullOrWhiteSpace(req.Email) && !req.Email.Equals(user.Email, StringComparison.OrdinalIgnoreCase))
                {
                    var existingUserByEmail = await userManager.FindByEmailAsync(req.Email);
                    if (existingUserByEmail != null && existingUserByEmail.Id != id)
                    {
                        return Results.BadRequest(new { mensagem = "duplicate_email" });
                    }

                    var emailResult = await userManager.SetEmailAsync(user, req.Email);
                    if (!emailResult.Succeeded)
                    {
                        return Results.BadRequest(new { mensagem = "Erro ao atualizar o e-mail." });
                    }
                }

                // 2. Validação Antecipada e Atualização do Nome de Usuário (Username)
                if (!string.IsNullOrWhiteSpace(req.Username) && !req.Username.Equals(user.UserName, StringComparison.OrdinalIgnoreCase))
                {
                    var existingUserByUsername = await userManager.FindByNameAsync(req.Username);
                    if (existingUserByUsername != null && existingUserByUsername.Id != id)
                    {
                        return Results.BadRequest(new { mensagem = "duplicate_username" });
                    }

                    var userResult = await userManager.SetUserNameAsync(user, req.Username);
                    if (!userResult.Succeeded)
                    {
                        return Results.BadRequest(new { mensagem = "Erro ao atualizar o nome de usuário." });
                    }
                }

                // 3. Atualização de Senha
                if (!string.IsNullOrWhiteSpace(req.Password))
                {
                    var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);
                    var passResult = await userManager.ResetPasswordAsync(user, resetToken, req.Password);

                    if (!passResult.Succeeded)
                    {
                        return Results.BadRequest(passResult.Errors);
                    }
                }

                // 👇 FORÇA O SALVAMENTO DAS ALTERAÇÕES DE TEXTO ANTES DE ALTERAR AS ROLES
                var updateResult = await userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                {
                    return Results.BadRequest(new { mensagem = "Erro ao persistir atualizações cadastrais." });
                }

                // 4. Atualização de Permissão (Admin)
                if (req.IsAdmin.HasValue)
                {
                    var isCurrentlyAdmin = await userManager.IsInRoleAsync(user, "Admin");

                    if (req.IsAdmin.Value && !isCurrentlyAdmin)
                    {
                        await userManager.AddToRoleAsync(user, "Admin");
                        // Atualiza o carimbo de segurança para validar a nova role
                        await userManager.UpdateSecurityStampAsync(user);
                    }
                    else if (!req.IsAdmin.Value && isCurrentlyAdmin)
                    {
                        var adminUsers = await userManager.GetUsersInRoleAsync("Admin");

                        if (adminUsers.Count <= 1)
                        {
                            return Results.BadRequest(new { mensagem = "only_admin_error" });
                        }

                        var removeResult = await userManager.RemoveFromRoleAsync(user, "Admin");
                        if (!removeResult.Succeeded)
                        {
                            return Results.BadRequest(new { mensagem = "Erro ao remover privilégios de administrador." });
                        }

                        // 👇 CRUCIAL: Atualiza o token/cookie de segurança do Identity para deslogar 
                        // ou revalidar o usuário com menos privilégios sem quebrar o estado do banco
                        await userManager.UpdateSecurityStampAsync(user);
                    }
                }

                return Results.Ok(new { mensagem = "Dados do usuário atualizados com sucesso!" });

            }).RequireAuthorization();

            // ==========================================
            // ENDPOINT: REGISTRAR NOVO USUÁRIO
            // ==========================================
            route.MapPost("/register", async (UserManager<IdentityUser> userManager, LoginRequest model) =>
            {
                // Verifica duplicidade de e-mail antes do cadastro
                var existingEmail = await userManager.FindByEmailAsync(model.Email);
                if (existingEmail != null)
                {
                    return Results.BadRequest(new { mensagem = "duplicate_email" });
                }

                // Verifica duplicidade de username antes do cadastro
                var existingUsername = await userManager.FindByNameAsync(model.Username);
                if (existingUsername != null)
                {
                    return Results.BadRequest(new { message = "duplicate_username" });
                }

                var user = new IdentityUser { UserName = model.Username, Email = model.Email };
                var result = await userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    if (model.IsAdmin)
                    {
                        await userManager.AddToRoleAsync(user, "Admin");
                    }

                    return Results.Ok(new { mensagem = "Usuário criado com sucesso!" });
                }

                return Results.BadRequest(result.Errors);

            }).RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });

            // ==========================================
            // ENDPOINT: OBTER MEUS DADOS (/me)
            // ==========================================
            route.MapGet("/me", (ClaimsPrincipal user) =>
            {
                var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userEmail = user.FindFirst(ClaimTypes.Email)?.Value;
                var userName = user.FindFirst(ClaimTypes.Name)?.Value;

                var roles = user.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
                var isAdmin = user.IsInRole("Admin");

                return Results.Ok(new
                {
                    id = userId,
                    email = userEmail,
                    userName = userName,
                    roles = roles,
                    isAdmin = isAdmin,
                    mensagem = "Usuário está autenticado!"
                });

            }).RequireAuthorization();

            // ==========================================
            // ENDPOINT: DELETAR USUÁRIO
            // ==========================================
            route.MapDelete("users/{id}", async (UserManager<IdentityUser> userManager, string id) =>
            {
                var user = await userManager.FindByIdAsync(id);

                if (user == null)
                    return Results.NotFound(new { mensagem = "Usuário não encontrado." });

                var isAdmin = await userManager.IsInRoleAsync(user, "Admin");

                if (isAdmin)
                {
                    var adminUsers = await userManager.GetUsersInRoleAsync("Admin");

                    if (adminUsers.Count <= 1)
                    {
                        return Results.BadRequest(new { mensagem = "only_admin_error" });
                    }
                }

                var result = await userManager.DeleteAsync(user);

                if (result.Succeeded)
                {
                    return Results.Ok(new { mensagem = "Usuário deletado com sucesso!" });
                }

                return Results.BadRequest(result.Errors);

            }).RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
        }
    }
}