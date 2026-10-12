#Requires -Version 5.1
[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$Root = Split-Path -Path $PSScriptRoot -Parent

$ManifestPath   = Join-Path $Root 'manifest.json'
$ContentPath    = Join-Path $Root 'content.js'
$BackgroundPath = Join-Path $Root 'background.js'
$PopupHtmlPath  = Join-Path $Root 'popup.html'
$PopupJsPath    = Join-Path $Root 'popup.js'

$Failed = $false

function Fail {
    param([string]$Message)
    Write-Host "FAIL: $Message"
    $script:Failed = $true
}

function Pass {
    param([string]$Message)
    Write-Host "PASS: $Message"
}

function HasProp {
    param([PSObject]$Obj, [string]$Name)
    return ($null -ne $Obj -and $null -ne $Obj.PSObject.Properties[$Name])
}

function FileContainsAll {
    param([string]$Path, [string[]]$Patterns, [string[]]$Labels)
    for ($i = 0; $i -lt $Patterns.Count; $i++) {
        if (Select-String -Path $Path -Pattern $Patterns[$i] -Quiet) {
            Pass $Labels[$i]
        } else {
            Fail "$($Labels[$i])"
        }
    }
}

function FileMustNotContain {
    param([string]$Path, [string]$Pattern, [string]$Label)
    if (Select-String -Path $Path -Pattern $Pattern -Quiet) {
        Fail $Label
    } else {
        Pass $Label
    }
}

# ============================================================
# A) manifest.json
# ============================================================
$manifest = $null
if (-not (Test-Path -LiteralPath $ManifestPath)) {
    Fail "manifest.json not found"
} else {
    try {
        $manifest = Get-Content -LiteralPath $ManifestPath -Raw | ConvertFrom-Json
        Pass "manifest.json is valid JSON"
    } catch {
        Fail "manifest.json is not valid JSON"
    }
}

if ($null -ne $manifest) {
    if (HasProp $manifest 'manifest_version') {
        if ($manifest.manifest_version -eq 3) { Pass "manifest_version == 3" }
        else { Fail "manifest_version is $($manifest.manifest_version), expected 3" }
    } else { Fail "manifest_version missing" }

    if (HasProp $manifest 'permissions') {
        if ($manifest.permissions -contains 'storage') { Pass "permissions contains storage" }
        else { Fail "permissions missing 'storage'" }
        if ($manifest.permissions -contains 'tabs') { Pass "permissions contains tabs" }
        else { Fail "permissions missing 'tabs'" }
        if ($manifest.permissions -contains 'contextMenus') { Pass "permissions contains contextMenus" }
        else { Fail "permissions missing 'contextMenus'" }
    } else { Fail "permissions missing" }

    if (HasProp $manifest 'background') {
        if (HasProp $manifest.background 'service_worker') {
            if ($manifest.background.service_worker -eq 'background.js') {
                Pass "background.service_worker == background.js"
            } else {
                Fail "background.service_worker is '$($manifest.background.service_worker)'"
            }
        } else { Fail "background.service_worker missing" }
    } else { Fail "background missing" }

    if (HasProp $manifest 'content_scripts') {
        if ($manifest.content_scripts.Count -gt 0) {
            $cs0 = $manifest.content_scripts[0]
            if (HasProp $cs0 'js') {
                if ($cs0.js -contains 'content.js') {
                    Pass "content_scripts[0].js contains content.js"
                } else { Fail "content_scripts[0].js does not contain content.js" }
            } else { Fail "content_scripts[0].js missing" }

            if (HasProp $cs0 'matches') {
                if ($cs0.matches -contains '<all_urls>') {
                    Pass "content_scripts[0].matches contains <all_urls>"
                } else { Fail "content_scripts[0].matches does not contain <all_urls>" }
            } else { Fail "content_scripts[0].matches missing" }

            if (HasProp $cs0 'run_at') {
                if ($cs0.run_at -eq 'document_start') {
                    Pass "content_scripts[0].run_at == document_start"
                } else { Fail "content_scripts[0].run_at is '$($cs0.run_at)', expected document_start" }
            } else { Fail "content_scripts[0].run_at missing" }

            if (HasProp $cs0 'all_frames') {
                if ($cs0.all_frames -eq $true) {
                    Pass "content_scripts[0].all_frames == true"
                } else { Fail "content_scripts[0].all_frames is not true" }
            } else { Fail "content_scripts[0].all_frames missing" }

            $manifest_str = Get-Content -LiteralPath $ManifestPath -Raw
            if ($manifest_str -match '"run_at"\s*:\s*"document_start"') {
                Pass "manifest has run_at document_start token"
            } else { Fail "manifest missing 'run_at document_start' token" }
            if ($manifest_str -match '"all_frames"\s*:\s*true') {
                Pass "manifest has all_frames true token"
            } else { Fail "manifest missing 'all_frames true' token" }
            if ($manifest_str -match '"cycle-mode"') {
                Pass "manifest has cycle-mode token"
            } else { Fail "manifest missing 'cycle-mode' token" }
            if ($manifest_str -match 'Alt\+Shift\+M') {
                Pass "manifest has Alt+Shift+M token"
            } else { Fail "manifest missing 'Alt+Shift+M' token" }
            if ($manifest_str -match '"toggle-site"') {
                Pass "manifest has toggle-site token"
            } else { Fail "manifest missing 'toggle-site' token" }
            if ($manifest_str -match 'Alt\+Shift\+S') {
                Pass "manifest has Alt+Shift+S token"
            } else { Fail "manifest missing 'Alt+Shift+S' token" }
        } else { Fail "content_scripts is empty" }
    } else { Fail "content_scripts missing" }

    if (HasProp $manifest 'action') {
        if (HasProp $manifest.action 'default_popup') {
            if ($manifest.action.default_popup -eq 'popup.html') {
                Pass "action.default_popup == popup.html"
            } else {
                Fail "action.default_popup is '$($manifest.action.default_popup)'"
            }
        } else { Fail "action.default_popup missing" }
    } else { Fail "action missing" }

    if (HasProp $manifest 'commands') {
        Pass "commands property exists"
        if (HasProp $manifest.commands 'toggle-nightshift') {
            Pass "commands.toggle-nightshift exists"
            $cmd = $manifest.commands.'toggle-nightshift'
            if (HasProp $cmd 'description') {
                Pass "commands.toggle-nightshift has description"
            } else { Fail "commands.toggle-nightshift missing description" }
        } else { Fail "commands.toggle-nightshift missing" }
    } else { Fail "commands property missing" }
}

# ============================================================
# B) content.js
# ============================================================
if (-not (Test-Path -LiteralPath $ContentPath)) {
    Fail "content.js not found"
} else {
    $patterns = @(
        'nightshift-style', 'nightshift-on', 'getComputedStyle',
        'nightshift\.brightness', 'nightshift\.contrast', 'nightshift\.warmth',
        'nightshift\.followSystem',
        'nightshift\.siteOff', 'prefers-color-scheme',
        'siteModes', '\[location\.hostname\]', 'nightshift\.siteOverrides',
        'chrome\.storage\.onChanged', 'nightshift-icon-invert',
        'nightshift\.fontSize', 'nightshift\.fontFamily', 'nightshift\.lineHeight',
        'nightshift\.customCss', 'nightshift\.customBg', 'nightshift\.customCard', '--ns-font-scale', '--ns-line-height', 'nightshift-custom',
        'transition:background-color', 'rgba\(16,16,16,0\.45\)',
        'adjBg', 'adjFg', 'card:\s*\[', '--ns-card',
        'color-mix',
        'STRUCTURAL_KEYS', 'OVERRIDE_KEYS', 'applyTint', 'var\(--ns-card\)', 'getState',
        '!state\.protectMedia', 'themeSurfaces\(state\)',
        'transition:background-color \.15s ease',
        'MutationObserver', 'watchDom', 'scrollbar-color:\#3A3D44 \#121212',
        'prefers-reduced-motion', 'var\(--ns-bg,\#121212\)',
        'var\(--ns-fg,\#E6E6E6\)', 'var\(--ns-accent,\#8AB4F8\)',
        'classList\.add\("nightshift-on"\)', '!document\.body', ',\s*500\s*\)',
        'scheduleOn', 'scheduleStart', 'scheduleEnd', 'inSchedule',
        'ensureScheduler', '30000', '\[contenteditable\]', 'input::selection',
        'buildProps\(state, \(state\.siteModes', 'a\) span\{color:inherit',
        'naturalWidth', 'dimRootBg', 'isGrad'
    )
    $labels = $patterns | ForEach-Object { $_ -replace '\\\.', '.' -replace '\\\(', '(' -replace '\\\)', ')' -replace '\\\[', '[' -replace '\\\]', ']' }
    FileContainsAll $ContentPath $patterns $labels

    FileMustNotContain $ContentPath 'hue-rotate' "content.js must NOT contain hue-rotate"
    FileMustNotContain $ContentPath 'nightshift-serif' "content.js must NOT contain nightshift-serif"
    FileMustNotContain $ContentPath 'grayscale' "content.js must NOT contain grayscale"
    FileMustNotContain $ContentPath 'data-ns-media-fx' "content.js must NOT contain data-ns-media-fx"
    FileMustNotContain $ContentPath 'respectDark' "content.js must NOT contain respectDark"
    FileMustNotContain $ContentPath 'pageIsDark' "content.js must NOT contain pageIsDark"
}

# ============================================================
# C) background.js
# ============================================================
if (-not (Test-Path -LiteralPath $BackgroundPath)) {
    Fail "background.js not found"
} else {
    $patterns = @(
        'nightshift\.enabled', 'nightshift\.mode', 'nightshift\.warmth',
        'chrome\.runtime\.onInstalled',
        'chrome\.storage\.onChanged', 'chrome\.commands\.onCommand', 'toggle-nightshift',
        'cycle-mode', 'contextMenus\.create', '"ns-page"', '"ns-site"',
        'contextMenus\.onClicked', 'siteModes', 'toggle-site'
    )
    $labels = $patterns | ForEach-Object { $_ -replace '\\\.', '.' -replace '\\\(', '(' -replace '\\\)', ')' -replace '\\\[', '[' -replace '\\\]', ']' }
    FileContainsAll $BackgroundPath $patterns $labels
    FileMustNotContain $BackgroundPath 'nightshift\.font' "background.js must NOT contain nightshift.font"
    FileMustNotContain $BackgroundPath 'mediaDim' "background.js must NOT contain mediaDim"
    FileMustNotContain $BackgroundPath 'respectDark' "background.js must NOT contain respectDark"
}

# ============================================================
# D) popup.html
# ============================================================
if (-not (Test-Path -LiteralPath $PopupHtmlPath)) {
    Fail "popup.html not found"
} else {
    if (Select-String -Path $PopupHtmlPath -Pattern '<script src="popup.js"></script>' -Quiet) {
        Pass "popup.html contains <script src=""popup.js""></script>"
    } else {
        Fail "popup.html missing <script src=""popup.js""></script>"
    }

    FileMustNotContain $PopupHtmlPath 'const DEFAULTS=' "popup.html must NOT contain const DEFAULTS= (inline script)"

    $scriptTagLines = Select-String -Path $PopupHtmlPath -Pattern '^\s*<script[^>]*>'
    $scriptTagCount = ($scriptTagLines | Measure-Object).Count
    if ($scriptTagCount -eq 1) {
        $theLine = $scriptTagLines[0].Line
        if ($theLine -match 'src=') {
            Pass "popup.html has exactly 1 script tag and it uses src="
        } else {
            Fail "popup.html has 1 script tag but it lacks src="
        }
    } else {
        Fail "popup.html has $scriptTagCount script tags, expected exactly 1"
    }

    $htmlContent = Get-Content -LiteralPath $PopupHtmlPath -Raw
    foreach ($marker in @('min="40"', 'max="160"', 'true black', 'ns-schedule', 'ns-sched-start', 'ns-sched-end', 'type="time"', 'ns-site-mode', 'ns-reset-brightness', 'ns-reset-contrast', 'ns-reset-warmth', 'ns-reset-more', 'scrollbar-color', 'button:hover', 'ns-font-size', 'ns-font-family', 'ns-line-height', 'ns-custom-bg', 'ns-custom-card', 'ns-custom-css', 'type="color"', 'Reading', 'Customize', 'fs-chip', 'data-fs')) {
        if ($htmlContent -match [regex]::Escape($marker)) {
            Pass "popup.html contains $marker"
        } else {
            Fail "popup.html missing $marker"
        }
    }

    $htmlPhase1 = @('<details', '<summary', 'Advanced')
    foreach ($marker in $htmlPhase1) {
        if ($htmlContent -match [regex]::Escape($marker)) {
            Pass "popup.html contains $marker"
        } else {
            Fail "popup.html missing $marker"
        }
    }

    FileMustNotContain $PopupHtmlPath 'ns-font"' "popup.html must NOT contain legacy ns-font id"
    FileMustNotContain $PopupHtmlPath 'Article font' "popup.html must NOT contain 'Article font'"
    FileMustNotContain $PopupHtmlPath 'ns-grayscale' "popup.html must NOT contain ns-grayscale"
    FileMustNotContain $PopupHtmlPath 'ns-mediadim' "popup.html must NOT contain ns-mediadim"
    FileMustNotContain $PopupHtmlPath 'ns-respect' "popup.html must NOT contain ns-respect"
}

# ============================================================
# E) popup.js
# ============================================================
if (-not (Test-Path -LiteralPath $PopupJsPath)) {
    Fail "popup.js not found"
} else {
    $patterns = @(
        'nightshift\.enabled', 'nightshift\.mode', 'nightshift\.protectMedia',
        'nightshift\.brightness', 'nightshift\.contrast', 'nightshift\.warmth',
        'nightshift\.followSystem',
        'nightshift\.siteOff', 'chrome\.tabs\.query',
        'siteModes', 'ns-site-mode',
        'adjBg', 'siteOverrides', 'setSite', 'clearSite',
        'nightshift\.scheduleOn', 'nightshift\.scheduleStart',
        'nightshift\.scheduleEnd',
        'nightshift\.fontSize', 'nightshift\.fontFamily', 'nightshift\.lineHeight',
        'nightshift\.customCss', 'nightshift\.customCard', 'paletteOf', '\.fs-chip',
        'ns-reset-brightness',
        'pending\s*=\s*2', 'disabled=true;cb\(\);return'
    )
    $labels = $patterns | ForEach-Object { $_ -replace '\\\.', '.' -replace '\\\(', '(' -replace '\\\)', ')' -replace '\\\[', '[' -replace '\\\]', ']' }
    FileContainsAll $PopupJsPath $patterns $labels
    FileMustNotContain $PopupJsPath 'nightshift\.font["\}]' "popup.js must NOT contain legacy nightshift.font key"
    FileMustNotContain $PopupJsPath 'grayscale' "popup.js must NOT contain grayscale"
    FileMustNotContain $PopupJsPath 'mediaDim' "popup.js must NOT contain mediaDim"
    FileMustNotContain $PopupJsPath 'respectDark' "popup.js must NOT contain respectDark"
}

# ============================================================
# F) Node.js syntax check
# ============================================================
$nodeAvailable = Get-Command node -ErrorAction SilentlyContinue
if ($nodeAvailable) {
    foreach ($jsFile in @($ContentPath, $BackgroundPath, $PopupJsPath)) {
        $name = Split-Path $jsFile -Leaf
        if (Test-Path -LiteralPath $jsFile) {
            & node --check $jsFile 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Pass "node --check $name"
            } else {
                Fail "node --check $name failed"
            }
        } else {
            Write-Host "WARNING: $name not found, skipping syntax check"
        }
    }
} else {
    Write-Host "WARNING: Node.js not found - JS syntax checking skipped"
}

# ============================================================
# Summary
# ============================================================
Write-Host ''
if ($Failed) {
    Write-Host 'RESULT: FAIL'
    exit 1
} else {
    Write-Host 'RESULT: PASS'
    exit 0
}