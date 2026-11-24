using System.Data.Common;
using Microsoft.Data.SqlClient;

namespace BackEnd.Common.Data;

public interface IStoredProcedureExecutor
{
    Task<int> ExecuteAsync(
        string procedure,
        IEnumerable<SqlParameter>? parameters = null,
        CancellationToken cancellationToken = default);

    Task<List<T>> QueryAsync<T>(
        string procedure,
        Func<DbDataReader, T> map,
        IEnumerable<SqlParameter>? parameters = null,
        CancellationToken cancellationToken = default);
}
