using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using FluentEmail.MailKitSmtp;
using MailKit.Security;
using System.Text;
using Vendinha.Config;
using Vendinha.Data;
using Vendinha.Routes;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<VendinhaContext>(options =>
options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentityCore<IdentityUser>()
    .AddEntityFrameworkStores<VendinhaContext>()
    .AddDefaultTokenProviders();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>


    {
        if (builder.Environment.IsDevelopment())
        {
            policy.WithOrigins("http://localhost:8080", "http://127.0.0.1:5500", "http://localhost:5500");
        }
        else
        {
            policy.WithOrigins("https://vendinha-p0hv.onrender.com");
        }

        policy
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials(); 
    });
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true, 
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = builder.Configuration["Jwt:Issuer"]!,
        ValidAudience = builder.Configuration["Jwt:Audience"]!,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (context.Request.Cookies.ContainsKey("jwt_token"))
            {
                context.Token = context.Request.Cookies["jwt_token"];
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddCloudinary(builder.Configuration);

var senderEmail = builder.Configuration["EmailSettings:SenderEmail"] ?? "vendinha.solidaria@gmail.com";

// Alterado para SmtpClientOptions e adicionado ?? "" para evitar warnings de nulo
var mailKitOptions = new SmtpClientOptions
{
    Server = builder.Configuration["EmailSettings:SmtpHost"] ?? "smtp.gmail.com",
    Port = builder.Configuration.GetValue<int>("EmailSettings:SmtpPort"),
    RequiresAuthentication = true,
    User = builder.Configuration["EmailSettings:SmtpUser"] ?? "",
    Password = builder.Configuration["EmailSettings:SmtpPassword"] ?? "",
    SocketOptions = SecureSocketOptions.SslOnConnect
};

builder.Services.AddFluentEmail(senderEmail)
    .AddMailKitSender(mailKitOptions);
builder.Services.AddAuthorization();
builder.Services.AddHostedService<Vendinha.Workers.LowStockWorker>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<VendinhaContext>();

    context.Database.Migrate();

    await DbInitializer.InitializeAsync(scope.ServiceProvider);
}

var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Urls.Add($"http://*:{port}");
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.ProductRoutes();
app.OutflowsRoutes();
app.InflowsRoutes();
app.PlacesRoutes();
app.StockRoutes();
app.LoginRoutes();
app.InvoicesRoutes();

app.MapFallbackToFile("/index.html");

app.Run();