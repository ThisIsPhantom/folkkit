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
    $output = ''
    $errorOutput = ''
    if (Test-Path $stdout) { $output = [string](Get-Content -LiteralPath $stdout -Raw) }
    if (Test-Path $stderr) { $errorOutput = [string](Get-Content -LiteralPath $stderr -Raw) }
    if ($null -eq $output) { $output = '' }
    if ($null -eq $errorOutput) { $errorOutput = '' }
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
    Assert-Equal $validReportA.ExitCode 0 "A valid runtime tree must pass. Error: $($validReportA.Error)"
    Assert-Equal $validReportA.Report.FileCount 10 'The validator must count every runtime file.'
    Assert-Equal $validReportA.Report.ForbiddenFileCount 0 'The valid fixture must contain no forbidden file.'
    Assert-Equal $validReportA.Report.TreeHash $validReportB.Report.TreeHash 'Tree hashes must not depend on the fixture root.'
    Assert-Equal $validReportA.Report.HostingSecurityPolicyValid $true 'The reviewed Hosttech configuration must enforce the security and fallback contract.'
    Assert-Equal $validReportA.Report.FormActionNone $true 'The production policy must forbid all form submissions.'
    Assert-Equal $validReportA.Report.HttpsRedirectValid $true 'HTTP must redirect permanently to the same HTTPS host and request before the SPA fallback.'
    Assert-Equal $validReportA.Report.HstsValid $true 'HTTPS responses must send the reviewed conservative HSTS policy.'

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
        'secrets/api-token.txt', 'notes.txt', 'assets/package.json', 'assets/secrets.json',
        'assets/api-token.json', 'assets/.env.json'
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
    Write-FixtureFile $validationFixture 'line-endings.txt' "first`nsecond`n"
    & git -C $validationFixture config core.autocrlf true
    & git -C $validationFixture add .
    & git -C $validationFixture commit -m 'validation fixture' | Out-Null

    $fakeBun = Join-Path $temporaryRoot 'fake-bun.cmd'
$fakeBunSource = @'
@echo off
echo fake bun stdout
if /I "%~1"=="install" powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%FOLKKIT_LINE_ENDING_CHECK%" || exit /b 42
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
    $lineEndingCheck = Join-Path $temporaryRoot 'check-line-endings.ps1'
    $lineEndingCheckSource = @'
$bytes = [System.IO.File]::ReadAllBytes((Join-Path (Get-Location) 'line-endings.txt'))
if ($bytes -contains 13) { exit 42 }
exit 0
'@
    [System.IO.File]::WriteAllText($lineEndingCheck, $lineEndingCheckSource, [System.Text.UTF8Encoding]::new($false))

    $validationRefsBefore = (& git -C $validationFixture show-ref) -join "`n"
    $validationStatusBefore = (& git -C $validationFixture status --porcelain=v1) -join "`n"
    $validationBranchBefore = (& git -C $validationFixture branch --show-current).Trim()
    $env:FOLKKIT_BUN_EXECUTABLE = $fakeBun
    $env:FOLKKIT_LINE_ENDING_CHECK = $lineEndingCheck
    Push-Location $validationFixture
    try {
        $validationOutput = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $publisherPath -SourceRef feature/folkkit-v1 -TargetBranch plesk -Remote origin -ValidateOnly 2>&1
        $validationExitCode = $LASTEXITCODE
    } finally {
        Pop-Location
        Remove-Item Env:FOLKKIT_BUN_EXECUTABLE -ErrorAction SilentlyContinue
        Remove-Item Env:FOLKKIT_LINE_ENDING_CHECK -ErrorAction SilentlyContinue
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

    $publishFixture = Join-Path $temporaryRoot 'publish-main'
    $publishOrigin = Join-Path $temporaryRoot 'publish-origin.git'
    & git init --bare $publishOrigin | Out-Null
    & git init -b main $publishFixture | Out-Null
    & git -C $publishFixture config user.name 'Folkkit Test'
    & git -C $publishFixture config user.email 'folkkit-test@example.invalid'
    New-Item -ItemType Directory -Path (Join-Path $publishFixture 'hosting') -Force | Out-Null
    Copy-Item -LiteralPath $reviewedHtaccessPath -Destination (Join-Path $publishFixture 'hosting\.htaccess')
    Write-FixtureFile $publishFixture '.gitignore' "dist/`n"
    Write-FixtureFile $publishFixture 'README.md' 'first source'
    & git -C $publishFixture add .
    & git -C $publishFixture commit -m 'first source' | Out-Null
    & git -C $publishFixture remote add origin $publishOrigin
    & git -C $publishFixture push -u origin main | Out-Null
    & git -C $publishFixture update-ref refs/remotes/origin/plesk HEAD

    $pushBun = Join-Path $temporaryRoot 'push-bun.cmd'
    $pushBunSource = @'
@echo off
if /I not "%~1"=="run" exit /b 23
if /I not "%~2"=="build:release" exit /b 24
if "%FOLKKIT_RELEASE_COMMIT%"=="" exit /b 31
for /f %%H in ('git rev-parse HEAD') do set CURRENT_HEAD=%%H
if not "%FOLKKIT_RELEASE_COMMIT%"=="%CURRENT_HEAD%" exit /b 32
mkdir dist\assets 2>nul
mkdir dist\vendor\ffmpeg 2>nul
copy /Y "%FOLKKIT_REVIEWED_HTACCESS%" dist\.htaccess >nul
>dist\index.html echo ^<!doctype html^>
>dist\manifest.json echo {}
>dist\favicon.svg echo ^<svg /^>
>dist\theme-init.js echo void 0
>dist\sw.js echo void 0
>dist\assets\app-a1.js echo void 0
>dist\assets\app-a1.css echo body{}
>dist\vendor\ffmpeg\ffmpeg-core.js echo void 0
>dist\vendor\ffmpeg\ffmpeg-core.wasm echo wasm
if "%FOLKKIT_TEST_RACE_HEAD%"=="1" goto race
exit /b 0
:race
>race.txt echo source moved during build
git add race.txt
git commit -m "race source" >nul
exit /b 0
'@
    [System.IO.File]::WriteAllText($pushBun, $pushBunSource, [System.Text.Encoding]::ASCII)

    $env:FOLKKIT_BUN_EXECUTABLE = $pushBun
    $env:FOLKKIT_REVIEWED_HTACCESS = $reviewedHtaccessPath
    $firstStatusBefore = (& git -C $publishFixture status --porcelain=v1) -join "`n"
    Push-Location $publishFixture
    try {
        $firstPushOutput = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $publisherPath -SourceRef main -TargetBranch plesk -Remote origin -Push 2>&1
        $firstPushExit = $LASTEXITCODE
    } finally {
        Pop-Location
    }
    Assert-Equal $firstPushExit 0 "The first synchronized main push must succeed. Output: $($firstPushOutput -join ' | ')"
    $firstStatusAfter = (& git -C $publishFixture status --porcelain=v1) -join "`n"
    Assert-Equal $firstStatusAfter $firstStatusBefore 'The first push must leave the worktree unchanged.'
    $firstPlesk = (& git --git-dir $publishOrigin rev-parse refs/heads/plesk).Trim()
    $firstParents = ((& git --git-dir $publishOrigin rev-list --parents -n 1 $firstPlesk).Trim()) -split '\s+'
    Assert-Equal $firstParents.Count 1 'An absent remote plesk branch must create a root commit even when a stale tracking ref exists.'

    $firstArchive = Join-Path $temporaryRoot 'first-plesk.tar'
    $firstTree = Join-Path $temporaryRoot 'first-plesk-tree'
    New-Item -ItemType Directory -Path $firstTree -Force | Out-Null
    & git --git-dir $publishOrigin -c core.autocrlf=false archive --format=tar "--output=$firstArchive" refs/heads/plesk
    & tar -xf $firstArchive -C $firstTree
    $firstDistReport = Invoke-Validator (Join-Path $publishFixture 'dist')
    $firstTreeReport = Invoke-Validator $firstTree
    Assert-Equal $firstTreeReport.Report.TreeHash $firstDistReport.Report.TreeHash 'The first remote hosting tree must exactly match dist.'

    Write-FixtureFile $publishFixture 'README.md' 'second source'
    & git -C $publishFixture add README.md
    & git -C $publishFixture commit -m 'second source' | Out-Null
    & git -C $publishFixture push origin main | Out-Null
    $secondStatusBefore = (& git -C $publishFixture status --porcelain=v1) -join "`n"
    Push-Location $publishFixture
    try {
        $secondPushOutput = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $publisherPath -SourceRef main -TargetBranch plesk -Remote origin -Push 2>&1
        $secondPushExit = $LASTEXITCODE
    } finally {
        Pop-Location
    }
    Assert-Equal $secondPushExit 0 "The second synchronized main push must succeed. Output: $($secondPushOutput -join ' | ')"
    $secondStatusAfter = (& git -C $publishFixture status --porcelain=v1) -join "`n"
    Assert-Equal $secondStatusAfter $secondStatusBefore 'The second push must leave the worktree unchanged.'
    $secondPlesk = (& git --git-dir $publishOrigin rev-parse refs/heads/plesk).Trim()
    Assert-True ($secondPlesk -ne $firstPlesk) 'The second push must create a new hosting commit.'
    Assert-Equal ((& git --git-dir $publishOrigin rev-parse "$secondPlesk^").Trim()) $firstPlesk 'The second hosting commit must extend the first one linearly.'

    $remoteBeforeRace = (& git --git-dir $publishOrigin rev-parse refs/heads/plesk).Trim()
    $env:FOLKKIT_TEST_RACE_HEAD = '1'
    Push-Location $publishFixture
    $previousErrorAction = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $raceOutput = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $publisherPath -SourceRef main -TargetBranch plesk -Remote origin -Push 2>&1
        $raceExit = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $previousErrorAction
        Pop-Location
        Remove-Item Env:FOLKKIT_TEST_RACE_HEAD -ErrorAction SilentlyContinue
        Remove-Item Env:FOLKKIT_BUN_EXECUTABLE -ErrorAction SilentlyContinue
        Remove-Item Env:FOLKKIT_REVIEWED_HTACCESS -ErrorAction SilentlyContinue
    }
    Assert-True ($raceExit -ne 0) 'A source commit race during the build must abort before updating plesk.'
    Assert-True (($raceOutput -join "`n") -match 'source|HEAD|synchron') 'The source race rejection must identify the changed source state.'
    Assert-Equal ((& git --git-dir $publishOrigin rev-parse refs/heads/plesk).Trim()) $remoteBeforeRace 'A source race must leave the remote plesk ref unchanged.'

    Write-Output 'Plesk hosting contract tests passed.'
} finally {
    Remove-Item -LiteralPath $temporaryRoot -Recurse -Force -ErrorAction SilentlyContinue
}
