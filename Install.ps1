$ErrorActionPreference = 'Stop'
$edgePaths = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe", "$env:LOCALAPPDATA\Microsoft\Edge\Application\msedge.exe")
$edge = $edgePaths | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $edge) { throw 'Microsoft Edge was not found. Open index.html in your browser.' }
$pagePath = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot 'index.html')).Path
$pageUri = ([System.Uri]$pagePath).AbsoluteUri
$shell = New-Object -ComObject WScript.Shell
$desktopPath = [Environment]::GetFolderPath('Desktop')
$shortcut = $shell.CreateShortcut((Join-Path $desktopPath 'CodeStage.lnk'))
$shortcut.TargetPath = $edge
$shortcut.Arguments = '--app="' + $pageUri + '"'
$shortcut.WorkingDirectory = $PSScriptRoot
$shortcut.Description = 'CodeStage local filming workspace'
$shortcut.Save()
Write-Output "Installed shortcut: $(Join-Path $desktopPath 'CodeStage.lnk')"
