[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$validatorPath = Join-Path $projectRoot 'scripts\Test-PleskTree.ps1'
$publisherPath = Join-Path $projectRoot 'scripts\Publish-PleskBranch.ps1'
$reviewedHtaccessPath = Join-Path $projectRoot 'hosting\.htaccess'
$temporaryRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("folkkit-plesk-tests-{0}" -f [Guid]::NewGuid().ToString('N'))

function Assert-Equal {
    param([object]$Actual, [object]$Expected, [string]$Message)
    if ($Actual -ne $Expected) {
        throw "$Message Expected '$Expected', received '$Actual'."
    }
}

function Assert-True {
    param([bool]$Condition, [string]$Message)
    if (-not $Condition) { throw $Message }
}

function Write-FixtureFile {
    param([string]$Root, [string]$RelativePath, [string]$Content = 'fixture')
    $path = Join-Path $Root $RelativePath
    $directory = Split-Path -Parent $path
    if ($directory) { New-Item -ItemType Directory -Path $directory -Force | Out-Null }
    [System.IO.File]::WriteAllText($path, $Content, [System.Text.UTF8Encoding]::new($false))
}

function New-ValidTree {
    param([string]$Root)
    New-Item -ItemType Directory -Path $Root -Force | Out-Null
    Write-FixtureFile $Root 'index.html' '<!doctype html>'
    $reviewedHtaccess = [System.IO.File]::ReadAllText($reviewedHtaccessPath)
    Write-FixtureFile $Root '.htaccess' $reviewedHtaccess
    Write-FixtureFile $Root 'manifest.json' '{}'
    Write-FixtureFile $Root 'favicon.svg' '<svg />'
    Write-FixtureFile $Root 'theme-init.js' 'void 0'
    Write-FixtureFile $Root 'sw.js' 'void 0'
    Write-FixtureFile $Root 'assets/app-a1.js' 'void 0'
    Write-FixtureFile $Root 'assets/app-a1.css' 'body{}'
    Write-FixtureFile $Root 'vendor/ffmpeg/ffmpeg-core.js' 'void 0'
    Write-FixtureFile $Root 'vendor/ffmpeg/ffmpeg-core.wasm' 'wasm'
}

function Invoke-Validator {
    param([string]$SourcePath, [string]$ReviewedHtaccessPath)
    $stdout = Join-Path $temporaryRoot ("stdout-{0}.txt" -f [Guid]::NewGuid().ToString('N'))
    $stderr = Join-Path $temporaryRoot ("stderr-{0}.txt" -f [Guid]::NewGuid().ToString('N'))
    $arguments = @(
        '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $validatorPath,
        '-SourcePath', $SourcePath, '-AsJson'
    )
    if ($ReviewedHtaccessPath) { $arguments += @('-ReviewedHtaccessPath', $ReviewedHtaccessPath) }
    $process = Start-Process -FilePath 'powershell.exe' -ArgumentList $arguments -NoNewWindow -Wait -PassThru -RedirectStandardOutput $stdout -RedirectStandardError $stderr
    $output = if (Test-Path $stdout) { Get-Content -LiteralPath $stdout -Raw } else { '' }
    $errorOutput = if (Test-Path $stderr) { Get-Content -LiteralPath $stderr -Raw } else { '' }
    $report = $null
    if ($output.Trim()) {
        try { $report = $output.Trim() | ConvertFrom-Json } catch { $report = $null }
    }
    [pscustomobject]@{ ExitCode = $process.ExitCode; Report = $report; Error = $errorOutput }
}

try {
    New-Item -ItemType Directory -Path $temporaryRoot -Force | Out-Null

    $validA = Join-Path $temporaryRoot 'valid-a'
    $validB = Join-Path $temporaryRoot 'valid-b'
    New-ValidTree $validA
    New-ValidTree $validB
    $validReportA = Invoke-Validator $validA
    $validReportB = Invoke-Validator $validB
    Assert-Equal $validReportA.ExitCode 0 'A valid runtime tree must pass.'
    Assert-Equal $validReportA.Report.FileCount 10 'The validator must count every runtime file.'
    Assert-Equal $validReportA.Report.ForbiddenFileCount 0 'The valid fixture must contain no forbidden file.'
    Assert-Equal $validReportA.Report.TreeHash $validReportB.Report.TreeHash 'Tree hashes must not depend on the fixture root.'
    Assert-Equal $validReportA.Report.HostingSecurityPolicyValid $true 'The reviewed Hosttech configuration must enforce the security and fallback contract.'

    $insecureReviewPath = Join-Path $temporaryRoot 'insecure.htaccess'
    $insecureTree = Join-Path $temporaryRoot 'insecure-tree'
    New-ValidTree $insecureTree
    $insecureConfig = "Options -Indexes`nRewriteRule ^ index.html [L]`n"
    Write-FixtureFile $temporaryRoot 'insecure.htaccess' $insecureConfig
    Write-FixtureFile $insecureTree '.htaccess' $insecureConfig
    $insecureResult = Invoke-Validator -SourcePath $insecureTree -ReviewedHtaccessPath $insecureReviewPath
    Assert-True ($insecureResult.ExitCode -ne 0) 'A matching but insecure reviewed configuration must fail.'
    Assert-Equal $insecureResult.Report.HostingSecurityPolicyValid $false 'The validator must identify a missing security policy.'

    $missingRequired = Join-Path $temporaryRoot 'missing-required'
    New-ValidTree $missingRequired
    Remove-Item -LiteralPath (Join-Path $missingRequired 'index.html')
    $missingResult = Invoke-Validator $missingRequired
    Assert-True ($missingResult.ExitCode -ne 0) 'A hosting tree without index.html must fail.'
    Assert-Equal $missingResult.Report.MissingRequiredFileCount 1 'Missing required runtime files must be counted.'

    $tamperedHtaccess = Join-Path $temporaryRoot 'tampered-htaccess'
    New-ValidTree $tamperedHtaccess
    Write-FixtureFile $tamperedHtaccess '.htaccess' 'tampered config'
    $tamperedResult = Invoke-Validator $tamperedHtaccess
    Assert-True ($tamperedResult.ExitCode -ne 0) 'A hosting tree with an unreviewed .htaccess must fail.'

    $forbiddenPaths = @(
        'src/app.jsx', 'tests/flow.spec.js', 'docs/internal.md', 'scripts/tool.mjs',
        'AGENTS.md', 'package.json', 'bun.lock', 'assets/app.js.map', '.env',
        'secrets/api-token.txt', 'notes.txt'
    )
    foreach ($forbiddenPath in $forbiddenPaths) {
        $fixture = Join-Path $temporaryRoot ("forbidden-{0}" -f [Guid]::NewGuid().ToString('N'))
        New-ValidTree $fixture
        Write-FixtureFile $fixture $forbiddenPath
        $result = Invoke-Validator $fixture
        Assert-True ($result.ExitCode -ne 0) "Forbidden hosting input '$forbiddenPath' must fail."
        Assert-Equal $result.Report.ForbiddenFileCount 1 "Forbidden hosting input '$forbiddenPath' must be counted."
    }

    $pushFixture = Join-Path $temporaryRoot 'push-gate'
    $bareOrigin = Join-Path $temporaryRoot 'origin.git'
    New-Item -ItemType Directory -Path $pushFixture -Force | Out-Null
    & git init --bare $bareOrigin | Out-Null
    & git init -b feature/test $pushFixture | Out-Null
    & git -C $pushFixture config user.name 'Folkkit Test'
    & git -C $pushFixture config user.email 'folkkit-test@example.invalid'
    Write-FixtureFile $pushFixture 'README.md' 'fixture'
    & git -C $pushFixture add README.md
    & git -C $pushFixture commit -m 'fixture' | Out-Null
    & git -C $pushFixture remote add origin $bareOrigin
    & git -C $pushFixture push -u origin feature/test | Out-Null
    $beforeRefs = (& git -C $pushFixture show-ref) -join "`n"
    Push-Location $pushFixture
    $previousErrorAction = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $pushOutput = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $publisherPath -SourceRef feature/test -TargetBranch plesk -Remote origin -Push 2>&1
        $pushExitCode = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $previousErrorAction
        Pop-Location
    }
    $afterRefs = (& git -C $pushFixture show-ref) -join "`n"
    Assert-True ($pushExitCode -ne 0) 'Push must reject a non-main source before building.'
    Assert-Equal $afterRefs $beforeRefs 'The rejected push path must not mutate refs.'

    $validationFixture = Join-Path $temporaryRoot 'validation'
    New-Item -ItemType Directory -Path $validationFixture -Force | Out-Null
    & git init -b feature/folkkit-v1 $validationFixture | Out-Null
    & git -C $validationFixture config user.name 'Folkkit Test'
    & git -C $validationFixture config user.email 'folkkit-test@example.invalid'
    New-Item -ItemType Directory -Path (Join-Path $validationFixture 'hosting') -Force | Out-Null
    Copy-Item -LiteralPath $reviewedHtaccessPath -Destination (Join-Path $validationFixture 'hosting\.htaccess')
    Write-FixtureFile $validationFixture 'package.json' '{"scripts":{}}'
    Write-FixtureFile $validationFixture 'bun.lock' 'fixture lock'
    & git -C $validationFixture add .
    & git -C $validationFixture commit -m 'validation fixture' | Out-Null

    $fakeBun = Join-Path $temporaryRoot 'fake-bun.cmd'
    $fakeBunSource = @'
@echo off
if /I "%~1"=="install" exit /b 0
if /I "%~1"=="run" if /I "%~2"=="scripts/build-site.mjs" goto build
exit /b 23
:build
mkdir dist\assets 2>nul
mkdir dist\vendor\ffmpeg 2>nul
copy /Y hosting\.htaccess dist\.htaccess >nul
>dist\index.html echo ^<!doctype html^>
>dist\manifest.json echo {}
>dist\favicon.svg echo ^<svg /^>
>dist\theme-init.js echo void 0
>dist\sw.js echo void 0
>dist\assets\app-a1.js echo void 0
>dist\assets\app-a1.css echo body{}
>dist\vendor\ffmpeg\ffmpeg-core.js echo void 0
>dist\vendor\ffmpeg\ffmpeg-core.wasm echo wasm
exit /b 0
'@
    [System.IO.File]::WriteAllText($fakeBun, $fakeBunSource, [System.Text.Encoding]::ASCII)

    $validationRefsBefore = (& git -C $validationFixture show-ref) -join "`n"
    $validationStatusBefore = (& git -C $validationFixture status --porcelain=v1) -join "`n"
    $validationBranchBefore = (& git -C $validationFixture branch --show-current).Trim()
    $env:FOLKKIT_BUN_EXECUTABLE = $fakeBun
    Push-Location $validationFixture
    try {
        $validationOutput = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $publisherPath -SourceRef feature/folkkit-v1 -TargetBranch plesk -Remote origin -ValidateOnly 2>&1
        $validationExitCode = $LASTEXITCODE
    } finally {
        Pop-Location
        Remove-Item Env:FOLKKIT_BUN_EXECUTABLE -ErrorAction SilentlyContinue
    }
    $validationRefsAfter = (& git -C $validationFixture show-ref) -join "`n"
    $validationStatusAfter = (& git -C $validationFixture status --porcelain=v1) -join "`n"
    $validationBranchAfter = (& git -C $validationFixture branch --show-current).Trim()
    Assert-Equal $validationExitCode 0 'ValidateOnly must accept a clean local feature source ref.'
    Assert-True (($validationOutput -join "`n") -match 'forbidden files: 0') 'ValidateOnly must report a clean hosting tree.'
    Assert-Equal $validationRefsAfter $validationRefsBefore 'ValidateOnly must not mutate refs.'
    Assert-Equal $validationStatusAfter $validationStatusBefore 'ValidateOnly must not mutate the worktree.'
    Assert-Equal $validationBranchAfter $validationBranchBefore 'ValidateOnly must not change branches.'

    $aheadFixture = Join-Path $temporaryRoot 'ahead-main'
    $aheadOrigin = Join-Path $temporaryRoot 'ahead-origin.git'
    & git init --bare $aheadOrigin | Out-Null
    & git init -b main $aheadFixture | Out-Null
    & git -C $aheadFixture config user.name 'Folkkit Test'
    & git -C $aheadFixture config user.email 'folkkit-test@example.invalid'
    Write-FixtureFile $aheadFixture 'README.md' 'base'
    & git -C $aheadFixture add README.md
    & git -C $aheadFixture commit -m 'base' | Out-Null
    & git -C $aheadFixture remote add origin $aheadOrigin
    & git -C $aheadFixture push -u origin main | Out-Null
    Write-FixtureFile $aheadFixture 'README.md' 'local ahead'
    & git -C $aheadFixture add README.md
    & git -C $aheadFixture commit -m 'ahead' | Out-Null
    $aheadRemoteBefore = (& git --git-dir $aheadOrigin show-ref) -join "`n"
    Push-Location $aheadFixture
    $previousErrorAction = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $aheadOutput = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $publisherPath -SourceRef main -TargetBranch plesk -Remote origin -Push 2>&1
        $aheadExitCode = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $previousErrorAction
        Pop-Location
    }
    $aheadRemoteAfter = (& git --git-dir $aheadOrigin show-ref) -join "`n"
    Assert-True ($aheadExitCode -ne 0) 'Push must reject a main branch that is ahead of origin/main.'
    Assert-True (($aheadOutput -join "`n") -match 'synchron') "The unsynchronised push rejection must identify the gate. Output: $($aheadOutput -join ' | ')"
    Assert-Equal $aheadRemoteAfter $aheadRemoteBefore 'The rejected unsynchronised push must not update the remote.'

    Write-Output 'Plesk hosting contract tests passed.'
} finally {
    Remove-Item -LiteralPath $temporaryRoot -Recurse -Force -ErrorAction SilentlyContinue
}
