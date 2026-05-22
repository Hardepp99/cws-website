# Copy cws-headless plugin into the WAMP WordPress install (run after plugin code changes)
$src = Join-Path $PSScriptRoot "..\cws-headless"
$dest = "C:\wamp64\www\cws-cms\wp-content\plugins\cws-headless"
if (-not (Test-Path $dest)) {
    Write-Error "WordPress plugin dir not found: $dest"
    exit 1
}
Copy-Item -Path "$src\*" -Destination $dest -Recurse -Force
Write-Host "Synced plugin to $dest"
