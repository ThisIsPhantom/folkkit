[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$SourcePath,

    [string]$ReviewedHtaccessPath,

    [switch]$AsJson
)

$ErrorActionPreference = 'Stop'

function Get-RelativeHostingPath {
    param([string]$Root, [string]$FullName)
    $relative = $FullName.Substring($Root.Length).TrimStart([char[]]@('\', '/'))
    $relative.Replace('\', '/')
}

function Test-AllowedHostingPath {
    param([string]$RelativePath)
    $lowerPath = $RelativePath.ToLowerInvariant()
    $segments = @($lowerPath -split '/')
    $fileName = $segments[-1]
    $forbiddenSegments = @(
        '.git', '.github', 'docs', 'hosting', 'node_modules', 'scripts', 'secrets', 'src', 'tests'
    )
    if (@($segments | Where-Object { $forbiddenSegments -contains $_ }).Count -gt 0) { return $false }
    if ($fileName -match '^(?:package(?:-lock)?\.json|bun\.lockb?|pnpm-lock\.yaml|yarn\.lock)$') { return $false }
    if ($fileName -match '^\.env(?:\.|$)') { return $false }
    if ($fileName -match '(?:^|[-_.])(?:api[-_.]?token|credentials?|private[-_.]?key|secrets?|tokens?)(?:[-_.]|$)') { return $false }
    if ($RelativePath -ne 'manifest.json' -and $fileName -match 'manifest') { return $false }

    $exactFiles = @(
        '.htaccess', 'favicon.svg', 'index.html', 'manifest.json', 'sw.js', 'theme-init.js'
    )
    if ($exactFiles -contains $RelativePath) { return $true }
    if ($RelativePath -match '^assets/[A-Za-z0-9._-]+\.(?:avif|css|gif|ico|jpe?g|js|png|svg|wasm|webp|woff2?)$') { return $true }
    if ($RelativePath -match '^vendor/ffmpeg/ffmpeg-core\.(?:js|wasm)$') { return $true }
    return $false
}

function Get-NormalizedTextHash {
    param([string]$Path)
    $text = [System.IO.File]::ReadAllText($Path).Replace("`r`n", "`n").Replace("`r", "`n")
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($text)
    $algorithm = [System.Security.Cryptography.SHA256]::Create()
    try {
        ([System.BitConverter]::ToString($algorithm.ComputeHash($bytes))).Replace('-', '').ToLowerInvariant()
    } finally {
        $algorithm.Dispose()
    }
}

function Get-FileSha256 {
    param([string]$Path)
    $stream = [System.IO.File]::OpenRead($Path)
    $algorithm = [System.Security.Cryptography.SHA256]::Create()
    try {
        ([System.BitConverter]::ToString($algorithm.ComputeHash($stream))).Replace('-', '').ToLowerInvariant()
    } finally {
        $algorithm.Dispose()
        $stream.Dispose()
    }
}

function Test-HostingSecurityPolicy {
    param([string]$Path)
    $text = [System.IO.File]::ReadAllText($Path).Replace("`r`n", "`n").Replace("`r", "`n")
    $cspMatch = [regex]::Match($text, '(?m)^\s*Header always set Content-Security-Policy "([^"]+)"\s*$')
    if (-not $cspMatch.Success) { return $false }
    $csp = $cspMatch.Groups[1].Value
    $requiredCspDirectives = @(
        "default-src 'self'", "base-uri 'self'", "object-src 'none'", "frame-ancestors 'none'",
        "form-action 'none'", "script-src 'self' 'wasm-unsafe-eval'", "style-src 'self'",
        "img-src 'self' data: blob:", "font-src 'self'", "media-src 'self' blob:",
        "worker-src 'self'", "connect-src 'self'", "manifest-src 'self'"
    )
    foreach ($directive in $requiredCspDirectives) {
        if ($csp -notmatch "(?:^|;\s*)$([regex]::Escape($directive))(?:\s*;|$)") { return $false }
    }
    if ($csp -match '(?<!wasm-)''unsafe-eval''|''unsafe-inline''|https?:|\*') { return $false }

    $requiredPatterns = @(
        '(?m)^\s*Options\s+-Indexes\s*$',
        '(?m)^\s*AddType text/javascript \.js \.mjs\s*$',
        '(?m)^\s*AddType application/wasm \.wasm\s*$',
        '(?m)^\s*Header always set X-Content-Type-Options "nosniff"\s*$',
        '(?m)^\s*Header always set X-Frame-Options "DENY"\s*$',
        '(?m)^\s*Header always set Referrer-Policy "no-referrer"\s*$',
        '(?m)^\s*Header always set Permissions-Policy "[^"]*camera=\(\)[^"]*microphone=\(\)[^"]*payment=\(\)[^"]*"\s*$',
        '(?m)^\s*RewriteCond %\{REQUEST_FILENAME\} -f \[OR\]\s*$',
        '(?m)^\s*RewriteCond %\{REQUEST_FILENAME\} -d\s*$',
        '(?m)^\s*RewriteRule \^ - \[L\]\s*$',
        '(?m)^\s*RewriteRule \^ index\.html \[L\]\s*$'
    )
    foreach ($pattern in $requiredPatterns) {
        if ($text -notmatch $pattern) { return $false }
    }
    return $true
}

try {
    $resolvedSource = (Resolve-Path -LiteralPath $SourcePath -ErrorAction Stop).Path.TrimEnd('\', '/')
    if (-not (Test-Path -LiteralPath $resolvedSource -PathType Container)) {
        throw "Hosting source is not a directory: $resolvedSource"
    }

    $files = @(Get-ChildItem -LiteralPath $resolvedSource -Recurse -Force -File | ForEach-Object {
        [pscustomobject]@{
            Path = Get-RelativeHostingPath -Root $resolvedSource -FullName $_.FullName
            FullName = $_.FullName
            Length = $_.Length
            IsReparsePoint = [bool]($_.Attributes -band [System.IO.FileAttributes]::ReparsePoint)
        }
    } | Sort-Object Path)

    $forbidden = @($files | Where-Object { $_.IsReparsePoint -or -not (Test-AllowedHostingPath $_.Path) })
    $requiredFiles = @('.htaccess', 'favicon.svg', 'index.html', 'manifest.json', 'sw.js', 'theme-init.js')
    $actualPaths = @($files.Path)
    $missingRequired = @($requiredFiles | Where-Object { $actualPaths -notcontains $_ })

    if (-not $ReviewedHtaccessPath) {
        $ReviewedHtaccessPath = Join-Path (Split-Path -Parent $PSScriptRoot) 'hosting\.htaccess'
    }
    $hostingConfigMatches = $false
    $hostingSecurityPolicyValid = $false
    if ((Test-Path -LiteralPath $ReviewedHtaccessPath -PathType Leaf) -and ($actualPaths -contains '.htaccess')) {
        $expectedHash = Get-NormalizedTextHash -Path $ReviewedHtaccessPath
        $actualHash = Get-NormalizedTextHash -Path (Join-Path $resolvedSource '.htaccess')
        $hostingConfigMatches = $expectedHash -eq $actualHash
        $hostingSecurityPolicyValid = Test-HostingSecurityPolicy -Path $ReviewedHtaccessPath
    }

    $hashLines = foreach ($file in $files) {
        $contentHash = Get-FileSha256 -Path $file.FullName
        "{0}`0{1}`0{2}" -f $file.Path, $file.Length, $contentHash
    }
    $hashPayload = [System.Text.Encoding]::UTF8.GetBytes(($hashLines -join "`n"))
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
        $treeHash = ([System.BitConverter]::ToString($sha.ComputeHash($hashPayload))).Replace('-', '').ToLowerInvariant()
    } finally {
        $sha.Dispose()
    }

    $report = [pscustomobject]@{
        FileCount = $files.Count
        TreeHash = $treeHash
        ForbiddenFileCount = $forbidden.Count
        MissingRequiredFileCount = $missingRequired.Count
        HostingConfigMatches = $hostingConfigMatches
        HostingSecurityPolicyValid = $hostingSecurityPolicyValid
        FormActionNone = if ($hostingSecurityPolicyValid) {
            ([System.IO.File]::ReadAllText($ReviewedHtaccessPath) -match "form-action 'none'")
        } else { $false }
        ForbiddenFiles = @($forbidden | ForEach-Object { $_.Path })
        MissingRequiredFiles = @($missingRequired | ForEach-Object { $_ })
    }

    if ($AsJson) {
        $report | ConvertTo-Json -Compress -Depth 4
    } else {
        $report
    }

    $errors = @()
    if ($forbidden.Count -gt 0) { $errors += "forbidden files: $($forbidden.Path -join ', ')" }
    if ($missingRequired.Count -gt 0) { $errors += "missing required files: $($missingRequired -join ', ')" }
    if (-not $hostingConfigMatches) { $errors += 'the deployed .htaccess does not match hosting/.htaccess' }
    if (-not $hostingSecurityPolicyValid) { $errors += 'the reviewed .htaccess does not enforce the required security and SPA fallback policy' }
    if ($errors.Count -gt 0) {
        [Console]::Error.WriteLine("Plesk tree validation failed: $($errors -join '; ')")
        exit 1
    }
} catch {
    [Console]::Error.WriteLine($_.Exception.Message)
    exit 1
}
