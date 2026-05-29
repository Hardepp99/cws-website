# Run from repo root: powershell -File scripts/launch-local.ps1
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "=== 1. Seed CMS database (modern homepage, 12 blog, portfolio) ===" -ForegroundColor Cyan
php "$root\cms\scripts\migrate-seed.php"

Write-Host "`n=== 2. Clean Next.js cache ===" -ForegroundColor Cyan
$nextDir = Join-Path $root "frontend\.next"
if (Test-Path $nextDir) {
    Remove-Item -Recurse -Force $nextDir
}

Write-Host "`n=== 3. Start Next.js ===" -ForegroundColor Cyan
Write-Host "Open: http://localhost:3000" -ForegroundColor Green
Write-Host "NOT: http://localhost/cws-website/php/" -ForegroundColor Yellow
Set-Location (Join-Path $root "frontend")
npm run dev
