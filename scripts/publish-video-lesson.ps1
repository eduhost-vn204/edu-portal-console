param(
  [Parameter(Mandatory = $false)][string]$InboxDir = "inbox\b10-pilot",
  [switch]$Mock,
  [switch]$Force
)

$ErrorActionPreference = 'Stop'

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "LAUNCHER: Xưởng Xuất Bản Bài Học Tự Động (Pilot B10)" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "Thư mục bài học: $InboxDir" -ForegroundColor Yellow

if (-not (Test-Path -LiteralPath $InboxDir)) {
  Write-Error "Không tìm thấy thư mục: $InboxDir"
  exit 1
}

$manifestPath = Join-Path $InboxDir "manifest.json"
if (-not (Test-Path -LiteralPath $manifestPath)) {
  Write-Error "Không tìm thấy file manifest.json trong thư mục: $InboxDir"
  exit 1
}

$nodeArgs = @("scripts\youtube-lesson-pipeline.mjs", $InboxDir)
if ($Mock) { $nodeArgs += "--mock" }
if ($Force) { $nodeArgs += "--force" }

node @nodeArgs
if ($LASTEXITCODE -ne 0) {
  Write-Host "Quy trình gặp sự cố với mã lỗi: $LASTEXITCODE" -ForegroundColor Red
  exit $LASTEXITCODE
}

Write-Host "Quy trình hoàn tất thành công!" -ForegroundColor Green
