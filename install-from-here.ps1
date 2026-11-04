# 从本目录离线安装三件套到 DSH desktop profile
$ErrorActionPreference = 'Stop'
$Base = Split-Path -Parent $MyInvocation.MyCommand.Path
$Profile_ = Join-Path $env:USERPROFILE '.dsh\profiles\desktop'
if (-not (Test-Path $Profile_)) { throw "找不到 profile: $Profile_" }
$Pkg = Join-Path $Profile_ 'package.json'
Copy-Item $Pkg "$Pkg.bak-$(Get-Date -Format yyyyMMdd-HHmmss)" -Force

$items = @(
  @{ name = '@oldsan888/dsh-global-memory';  tgz = 'oldsan888-dsh-global-memory-0.2.0.tgz' },
  @{ name = '@oldsan888/dsh-music-mode';     tgz = 'oldsan888-dsh-music-mode-0.2.0.tgz' },
  @{ name = '@oldsan888/dsh-voice-companion'; tgz = 'oldsan888-dsh-voice-companion-0.2.0.tgz' }
)

Push-Location $Profile_
foreach ($i in $items) {
  $file = Join-Path $Base ("tarballs\" + $i.tgz)
  if (-not (Test-Path $file)) { Write-Host "缺文件: $file" -ForegroundColor Yellow; continue }
  Write-Host "安装 $($i.name) ..."
  & pnpm add "file:$($file -replace '\\','/')" --ignore-scripts | Out-Null
}
Pop-Location

# bundles
$j = Get-Content $Pkg -Raw | ConvertFrom-Json
$list = @($j.dsh.profile.bundles)
foreach ($i in $items) { if ($list -notcontains $i.name) { $list += $i.name } }
$j.dsh.profile.bundles = $list
[IO.File]::WriteAllText($Pkg, ($j | ConvertTo-Json -Depth 8), (New-Object Text.UTF8Encoding($false)))

Write-Host ""
Write-Host "完成。重启 DSH 后生效。" -ForegroundColor Green
Write-Host "提示：dsh-voice-companion 还需要配置 MiMo TTS 的 Base URL 与 API Key。" -ForegroundColor Yellow
