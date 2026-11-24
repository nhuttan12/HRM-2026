using BackEnd.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
// Register application and feature services before building the host.
builder.Services.AddApplicationServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP pipeline and expose controller routes.
app.UseApplicationPipeline();
app.MapControllers();
app.Run();

public partial class Program { }
