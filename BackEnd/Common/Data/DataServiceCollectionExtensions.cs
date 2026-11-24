namespace BackEnd.Common.Data;

public static class DataServiceCollectionExtensions
{
    public static IServiceCollection AddDataAccess(this IServiceCollection services)
    {
        services.AddScoped<IStoredProcedureExecutor, StoredProcedureExecutor>();
        return services;
    }
}
