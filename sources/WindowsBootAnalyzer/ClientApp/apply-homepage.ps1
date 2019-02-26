#!/usr/bin/env pwsh
$pack = (Get-Content "package.json" | ConvertFrom-Json)
$homepage=$Env:WebPackHomePage;
if (-not $homepage) { $homepage=$null; }
Write-Host "Applying home page for project $($pack.name)"
try { $pack.PSObject.Properties.Remove("homepage"); } catch {}
if ($homepage) {
  $pack | Add-Member -NotePropertyName homepage -NotePropertyValue $homepage
}

$unixContent = ($pack | ConvertTo-Json).Replace("`r", "")
$Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
[System.IO.File]::WriteAllLines("package.json", $unixContent, $Utf8NoBomEncoding)
