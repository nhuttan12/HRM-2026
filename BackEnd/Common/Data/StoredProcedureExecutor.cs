using System.Data;
using System.Data.Common;
using Microsoft.Data.SqlClient;

namespace BackEnd.Common.Data;

// The caller owns supplied parameters; output parameter values are available after execution.
public sealed class StoredProcedureExecutor(IConfiguration configuration)
{
    private SqlConnection CreateConnection() => new(configuration.GetConnectionString("Hrm")
        ?? throw new InvalidOperationException("ConnectionStrings:Hrm is not configured."));

    public async Task<int> ExecuteAsync(string procedure, IEnumerable<SqlParameter>? parameters = null,
        CancellationToken cancellationToken = default)
    {
        await using var connection = CreateConnection();
        await using var command = BuildCommand(connection, procedure, parameters);
        await connection.OpenAsync(cancellationToken);
        return await command.ExecuteNonQueryAsync(cancellationToken);
    }

    public async Task<List<T>> QueryAsync<T>(string procedure, Func<DbDataReader, T> map,
        IEnumerable<SqlParameter>? parameters = null, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(map);
        await using var connection = CreateConnection();
        await using var command = BuildCommand(connection, procedure, parameters);
        await connection.OpenAsync(cancellationToken);
        var result = new List<T>();
        // Dispose the reader before returning, so output parameters are populated.
        await using (var reader = await command.ExecuteReaderAsync(cancellationToken))
            while (await reader.ReadAsync(cancellationToken)) result.Add(map(reader));
        return result;
    }

    private static SqlCommand BuildCommand(SqlConnection connection, string procedure, IEnumerable<SqlParameter>? parameters)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(procedure);
        var command = connection.CreateCommand();
        command.CommandText = procedure;
        command.CommandType = CommandType.StoredProcedure;
        if (parameters is not null) foreach (var parameter in parameters) command.Parameters.Add(parameter);
        return command;
    }
}
