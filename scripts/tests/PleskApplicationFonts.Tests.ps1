[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$validatorPath = Join-Path $projectRoot 'scripts/Test-PleskTree.ps1'
$shellPath = (Get-Process -Id $PID).Path
$temporaryRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("folkkit-font-tests-{0}" -f [Guid]::NewGuid().ToString('N'))

function Invoke-FontValidator {
    $stdout = Join-Path $temporaryRoot 'stdout.txt'
    $stderr = Join-Path $temporaryRoot 'stderr.txt'
    $arguments = @('-NoProfile', '-File', $validatorPath, '-SourcePath', (Join-Path $temporaryRoot 'tree'), '-AsJson')
    $process = Start-Process -FilePath $shellPath -ArgumentList $arguments -NoNewWindow -Wait -PassThru -RedirectStandardOutput $stdout -RedirectStandardError $stderr
    [pscustomobject]@{
        ExitCode = $process.ExitCode
        Report = (Get-Content -LiteralPath $stdout -Raw | ConvertFrom-Json)
        Error = (Get-Content -LiteralPath $stderr -Raw)
    }
}

try {
    $tree = Join-Path $temporaryRoot 'tree'
    $fontDirectory = Join-Path $tree 'fonts/application'
    New-Item -ItemType Directory -Path $fontDirectory -Force | Out-Null
    foreach ($path in @('favicon.svg', 'manifest.json', 'theme-init.js')) {
        Copy-Item -LiteralPath (Join-Path $projectRoot "public/$path") -Destination (Join-Path $tree $path)
    }
    Copy-Item -LiteralPath (Join-Path $projectRoot 'index.html') -Destination (Join-Path $tree 'index.html')
    Copy-Item -LiteralPath (Join-Path $projectRoot 'hosting/.htaccess') -Destination (Join-Path $tree '.htaccess')
    [System.IO.File]::WriteAllText((Join-Path $tree 'sw.js'), 'void 0')
    $manifest = Get-Content -LiteralPath (Join-Path $projectRoot 'scripts/runtime-assets.json') -Raw | ConvertFrom-Json
    foreach ($path in $manifest.fonts.distributedFiles) {
        Copy-Item -LiteralPath (Join-Path $projectRoot $path) -Destination $fontDirectory
    }

    $valid = Invoke-FontValidator
    if ($valid.ExitCode -ne 0 -or $valid.Report.ForbiddenFileCount -ne 0) {
        throw "Reviewed application fonts must pass the hosting validator: $($valid.Error)"
    }
    if ($valid.Report.FileCount -ne (6 + $manifest.fonts.distributedFiles.Count)) {
        throw 'Every reviewed application font must be included in the hosting tree.'
    }

    foreach ($name in @('Unreviewed-Regular.ttf', 'NotoSans-Light.ttf', 'NotoSans-Regular.ttf.php', 'NotoSans-Regular.woff2')) {
        $path = Join-Path $fontDirectory $name
        [System.IO.File]::WriteAllText($path, 'unreviewed')
        $invalid = Invoke-FontValidator
        if ($invalid.ExitCode -eq 0 -or $invalid.Report.ForbiddenFileCount -ne 1 -or $invalid.Report.ForbiddenFiles[0] -ne "fonts/application/$name") {
            throw "Unreviewed font neighbour must remain forbidden: $name"
        }
        Remove-Item -LiteralPath $path
    }
    Write-Output 'Plesk application font tests passed.'
} finally {
    if (Test-Path -LiteralPath $temporaryRoot) { Remove-Item -LiteralPath $temporaryRoot -Recurse -Force }
}
