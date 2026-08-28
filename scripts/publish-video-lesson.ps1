param(
  [Parameter(Mandatory = $false)][string]$InboxDir = "inbox\sample-lesson",
  [switch]$Mock,
  [switch]$Force
)

$ErrorActionPreference = 'Stop'

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "LAUNCHER: Video -> YouTube Private -> Bai hoc DRAFT" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "Thu muc bai hoc: $InboxDir" -ForegroundColor Yellow

if (-not (Test-Path -LiteralPath $InboxDir)) {
  Write-Error "Khong tim thay thu muc: $InboxDir"
  exit 1
}

$manifestPath = Join-Path $InboxDir "manifest.json"
if (-not (Test-Path -LiteralPath $manifestPath)) {
  Write-Error "Khong tim thay file manifest.json trong thu muc: $InboxDir"
  exit 1
}

$nodeArgs = @("scripts\youtube-lesson-pipeline.mjs", $InboxDir)
if ($Mock) { $nodeArgs += "--mock" }
if ($Force) { $nodeArgs += "--force" }

node @nodeArgs
if ($LASTEXITCODE -ne 0) {
  Write-Host "Quy trinh gap su co voi ma loi: $LASTEXITCODE" -ForegroundColor Red
  exit $LASTEXITCODE
}

Write-Host "Quy trinh hoan tat thanh cong!" -ForegroundColor Green
