[CmdletBinding(DefaultParameterSetName = 'Validate')]
param(
    [string]$SourceRef = 'main',
    [string]$TargetBranch = 'plesk',
    [string]$Remote = 'origin',

    [Parameter(Mandatory = $true, ParameterSetName = 'Validate')]
    [switch]$ValidateOnly,

    [Parameter(Mandatory = $true, ParameterSetName = 'Push')]
    [switch]$Push
)

$ErrorActionPreference = 'Stop'
$validatorPath = Join-Path $PSScriptRoot 'Test-PleskTree.ps1'
$temporaryRoot = $null

function Invoke-Git {
    param(
        [Parameter(Mandatory = $true)][string[]]$Arguments,
        [switch]$AllowFailure
    )
    $previousErrorAction = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $output = @(& git -C $script:repoRoot @Arguments 2>&1)
        $exitCode = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $previousErrorAction
    }
    if ($exitCode -ne 0 -and -not $AllowFailure) {
        throw "Git command failed ($exitCode): git $($Arguments -join ' ')`n$($output -join "`n")"
    }
    [pscustomobject]@{ ExitCode = $exitCode; Output = $output }
}

function Get-GitText {
    param([string[]]$Arguments)
    $result = Invoke-Git -Arguments $Arguments
    ($result.Output -join "`n").Trim()
}

function Assert-CleanWorktree {
    $status = Get-GitText @('status', '--porcelain=v1', '--untracked-files=normal')
    if ($status) { throw 'Publishing requires a clean worktree.' }
}

function Resolve-BunExecutable {
    if ($env:FOLKKIT_BUN_EXECUTABLE) {
        if (-not (Test-Path -LiteralPath $env:FOLKKIT_BUN_EXECUTABLE -PathType Leaf)) {
            throw "FOLKKIT_BUN_EXECUTABLE does not exist: $env:FOLKKIT_BUN_EXECUTABLE"
        }
        return (Resolve-Path -LiteralPath $env:FOLKKIT_BUN_EXECUTABLE).Path
    }
    $portable = Join-Path $script:repoRoot '.superpowers\tools\bun-v1.3.3\bun-windows-x64\bun.exe'
    if (Test-Path -LiteralPath $portable -PathType Leaf) { return $portable }
    $command = Get-Command bun -ErrorAction SilentlyContinue
    if ($command) { return $command.Source }
    throw 'Bun 1.3.3 is required. Set FOLKKIT_BUN_EXECUTABLE or install Bun on PATH.'
}

function Invoke-Bun {
    param([string]$WorkingDirectory, [string[]]$Arguments)
    Push-Location $WorkingDirectory
    $previousErrorAction = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        & $script:bunExecutable @Arguments
        if ($LASTEXITCODE -ne 0) {
            throw "Bun command failed ($LASTEXITCODE): bun $($Arguments -join ' ')"
        }
    } finally {
        $ErrorActionPreference = $previousErrorAction
        Pop-Location
    }
}

function Invoke-PleskTreeValidator {
    param([string]$Path)
    $stderrPath = Join-Path $script:temporaryRoot ("validator-{0}.err" -f [Guid]::NewGuid().ToString('N'))
    $output = @(& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $validatorPath -SourcePath $Path -AsJson 2>$stderrPath)
    $exitCode = $LASTEXITCODE
    $errors = if (Test-Path -LiteralPath $stderrPath) { Get-Content -LiteralPath $stderrPath -Raw } else { '' }
    if ($exitCode -ne 0) {
        throw "Plesk tree validation failed for $Path.`n$errors"
    }
    try {
        ($output -join "`n").Trim() | ConvertFrom-Json
    } catch {
        throw "Plesk tree validator returned invalid JSON for $Path."
    }
}

function New-ValidationBuild {
    param([string]$Commit)
    $sourceDirectory = Join-Path $script:temporaryRoot 'source'
    $archivePath = Join-Path $script:temporaryRoot 'source.tar'
    New-Item -ItemType Directory -Path $sourceDirectory -Force | Out-Null
    Invoke-Git -Arguments @('-c', 'core.autocrlf=false', 'archive', '--format=tar', "--output=$archivePath", $Commit) | Out-Null
    & tar -xf $archivePath -C $sourceDirectory
    if ($LASTEXITCODE -ne 0) { throw 'Unable to extract the validation source archive.' }
    [System.IO.File]::WriteAllText(
        (Join-Path $sourceDirectory '.folkkit-release-commit'),
        "$Commit`n",
        [System.Text.UTF8Encoding]::new($false)
    )

    $previousCommit = $env:FOLKKIT_RELEASE_COMMIT
    $env:FOLKKIT_RELEASE_COMMIT = $Commit
    try {
        Invoke-Bun -WorkingDirectory $sourceDirectory -Arguments @('install', '--frozen-lockfile', '--ignore-scripts', '--force')
        Invoke-Bun -WorkingDirectory $sourceDirectory -Arguments @('run', 'scripts/build-site.mjs')
    } finally {
        if ($null -eq $previousCommit) {
            Remove-Item Env:FOLKKIT_RELEASE_COMMIT -ErrorAction SilentlyContinue
        } else {
            $env:FOLKKIT_RELEASE_COMMIT = $previousCommit
        }
    }
    Join-Path $sourceDirectory 'dist'
}

function New-HostingTree {
    param([string]$DistPath)
    $indexPath = Join-Path $script:temporaryRoot 'hosting.index'
    $previousIndex = $env:GIT_INDEX_FILE
    $env:GIT_INDEX_FILE = $indexPath
    try {
        Invoke-Git -Arguments @('read-tree', '--empty') | Out-Null
        Invoke-Git -Arguments @('-c', 'core.autocrlf=false', "--work-tree=$DistPath", 'add', '--all', '--force', '--', '.') | Out-Null
        Get-GitText @('write-tree')
    } finally {
        if ($null -eq $previousIndex) {
            Remove-Item Env:GIT_INDEX_FILE -ErrorAction SilentlyContinue
        } else {
            $env:GIT_INDEX_FILE = $previousIndex
        }
    }
}

function Confirm-TreeMatchesDist {
    param([string]$Tree, [object]$DistReport)
    $treeDirectory = Join-Path $script:temporaryRoot 'tree'
    $treeArchive = Join-Path $script:temporaryRoot 'tree.tar'
    New-Item -ItemType Directory -Path $treeDirectory -Force | Out-Null
    Invoke-Git -Arguments @('-c', 'core.autocrlf=false', 'archive', '--format=tar', "--output=$treeArchive", $Tree) | Out-Null
    & tar -xf $treeArchive -C $treeDirectory
    if ($LASTEXITCODE -ne 0) { throw 'Unable to extract the generated hosting tree.' }
    $treeReport = Invoke-PleskTreeValidator -Path $treeDirectory
    if ($treeReport.FileCount -ne $DistReport.FileCount -or $treeReport.TreeHash -ne $DistReport.TreeHash) {
        throw 'Generated Git tree does not match the validated dist tree.'
    }
}

function Resolve-TargetParent {
    $reference = "refs/remotes/$Remote/$TargetBranch^{commit}"
    $result = Invoke-Git -Arguments @('rev-parse', '--verify', '--quiet', $reference) -AllowFailure
    if ($result.ExitCode -eq 0) { return ($result.Output -join "`n").Trim() }
    return $null
}

function New-HostingCommit {
    param([string]$Tree, [string]$SourceCommit, [string]$Parent)
    $sourceDate = Get-GitText @('show', '-s', '--format=%cI', $SourceCommit)
    $saved = @{
        GIT_AUTHOR_NAME = $env:GIT_AUTHOR_NAME
        GIT_AUTHOR_EMAIL = $env:GIT_AUTHOR_EMAIL
        GIT_AUTHOR_DATE = $env:GIT_AUTHOR_DATE
        GIT_COMMITTER_NAME = $env:GIT_COMMITTER_NAME
        GIT_COMMITTER_EMAIL = $env:GIT_COMMITTER_EMAIL
        GIT_COMMITTER_DATE = $env:GIT_COMMITTER_DATE
    }
    $env:GIT_AUTHOR_NAME = 'Folkkit Publisher'
    $env:GIT_AUTHOR_EMAIL = 'folkkit-publisher@users.noreply.github.com'
    $env:GIT_AUTHOR_DATE = $sourceDate
    $env:GIT_COMMITTER_NAME = 'Folkkit Publisher'
    $env:GIT_COMMITTER_EMAIL = 'folkkit-publisher@users.noreply.github.com'
    $env:GIT_COMMITTER_DATE = $sourceDate
    try {
        $arguments = @('commit-tree', $Tree, '-m', "Hosting build from $SourceCommit")
        if ($Parent) { $arguments += @('-p', $Parent) }
        Get-GitText $arguments
    } finally {
        foreach ($name in $saved.Keys) {
            if ($null -eq $saved[$name]) { Remove-Item "Env:$name" -ErrorAction SilentlyContinue }
            else { Set-Item "Env:$name" $saved[$name] }
        }
    }
}

try {
    if ($ValidateOnly -eq $Push) { throw 'Specify exactly one of -ValidateOnly or -Push.' }
    $repoResult = @(& git rev-parse --show-toplevel 2>&1)
    if ($LASTEXITCODE -ne 0) { throw 'Publish-PleskBranch.ps1 must run inside a Git repository.' }
    $script:repoRoot = ($repoResult -join "`n").Trim()
    Assert-CleanWorktree

    $sourceCommit = Get-GitText @('rev-parse', '--verify', "$SourceRef^{commit}")
    if ($sourceCommit -notmatch '^[0-9a-f]{40}$') { throw "SourceRef does not resolve to an exact commit: $SourceRef" }

    if ($Push) {
        if ($SourceRef -cne 'main') { throw 'Push requires -SourceRef main.' }
        $currentBranch = Get-GitText @('branch', '--show-current')
        if ($currentBranch -cne 'main') { throw 'Push requires the current branch to be main.' }
        if ((Get-GitText @('rev-parse', 'HEAD')) -ne $sourceCommit) { throw 'Push requires SourceRef main to equal HEAD.' }
        Invoke-Git -Arguments @('remote', 'get-url', $Remote) | Out-Null
        Invoke-Git -Arguments @('fetch', '--no-tags', $Remote, 'main') | Out-Null
        $upstream = Get-GitText @('rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}')
        if ($upstream -cne "$Remote/main") { throw "Push requires main to track $Remote/main." }
        $counts = (Get-GitText @('rev-list', '--left-right', '--count', "HEAD...$Remote/main")) -split '\s+'
        if ($counts.Count -ne 2 -or $counts[0] -ne '0' -or $counts[1] -ne '0') {
            throw "Push requires synchronized main and $Remote/main with zero ahead and zero behind."
        }
        Assert-CleanWorktree

        $remoteTarget = Invoke-Git -Arguments @('ls-remote', '--heads', $Remote, "refs/heads/$TargetBranch")
        if (($remoteTarget.Output -join '').Trim()) {
            Invoke-Git -Arguments @('fetch', '--no-tags', $Remote, "+refs/heads/$TargetBranch`:refs/remotes/$Remote/$TargetBranch") | Out-Null
        }
    }

    $script:bunExecutable = Resolve-BunExecutable
    $script:temporaryRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("folkkit-publish-{0}" -f [Guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Path $script:temporaryRoot -Force | Out-Null

    if ($Push) {
        Invoke-Bun -WorkingDirectory $script:repoRoot -Arguments @('run', 'build:release')
        $distPath = Join-Path $script:repoRoot 'dist'
        Assert-CleanWorktree
    } else {
        $distPath = New-ValidationBuild -Commit $sourceCommit
    }

    $distReport = Invoke-PleskTreeValidator -Path $distPath
    $hostingTree = New-HostingTree -DistPath $distPath
    Confirm-TreeMatchesDist -Tree $hostingTree -DistReport $distReport
    $parent = Resolve-TargetParent
    $hostingCommit = New-HostingCommit -Tree $hostingTree -SourceCommit $sourceCommit -Parent $parent

    Write-Output "Plesk tree files: $($distReport.FileCount); forbidden files: $($distReport.ForbiddenFileCount); tree hash: $($distReport.TreeHash)."
    Write-Output "Generated hosting commit $hostingCommit from source $sourceCommit without checking out $TargetBranch."

    if ($Push) {
        Invoke-Git -Arguments @('push', $Remote, "${hostingCommit}:refs/heads/$TargetBranch") | Out-Null
        Write-Output "Updated $Remote/$TargetBranch by fast-forward push. No Hosttech deployment was performed."
    } else {
        Write-Output 'ValidateOnly completed without branch, ref, or worktree mutation.'
    }
} catch {
    [Console]::Error.WriteLine($_.Exception.Message)
    exit 1
} finally {
    if ($temporaryRoot -and (Test-Path -LiteralPath $temporaryRoot)) {
        Remove-Item -LiteralPath $temporaryRoot -Recurse -Force -ErrorAction SilentlyContinue
    }
}
