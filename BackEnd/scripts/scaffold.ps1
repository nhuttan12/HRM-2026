Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$projectDirectory = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $projectDirectory '.env'
if (-not (Test-Path -LiteralPath $envFile -PathType Leaf)) {
    throw "Missing $envFile. Copy .env.example to .env and configure HRM_CONNECTION_STRING."
}

$connectionString = $null
foreach ($line in [System.IO.File]::ReadAllLines($envFile)) {
    if ($line -match '^\s*HRM_CONNECTION_STRING\s*=\s*(.*?)\s*$') {
        if ($null -ne $connectionString) {
            throw 'HRM_CONNECTION_STRING is defined more than once in .env.'
        }
        $connectionString = $Matches[1]
        if ($connectionString.Length -ge 2 -and
            (($connectionString.StartsWith('"') -and $connectionString.EndsWith('"')) -or
             ($connectionString.StartsWith("'") -and $connectionString.EndsWith("'")))) {
            $connectionString = $connectionString.Substring(1, $connectionString.Length - 2)
        }
    }
}
if ([string]::IsNullOrWhiteSpace($connectionString)) {
    throw 'HRM_CONNECTION_STRING is missing or empty in .env.'
}

Push-Location $projectDirectory
try {
    & dotnet ef dbcontext scaffold $connectionString Microsoft.EntityFrameworkCore.SqlServer `
        --context HrmDbContext --context-dir Data/Context --output-dir Data/Entities --no-onconfiguring
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
finally {
    Pop-Location
}
