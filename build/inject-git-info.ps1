function SaveAsJson { 
  param([object]$anObject, [string]$fileName) 
  $unixContent = ($anObject | ConvertTo-Json).Replace("`r", "")
  $Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
  [System.IO.File]::WriteAllLines($fileName, $unixContent, $Utf8NoBomEncoding)
}

function GetVersion {
  $ver = Get-Content "version.txt"
  return $ver
}

function IncrementBuild {
  $build = Get-Content "build.txt"
  $build = 1 + [long] $build
  $build > "build.txt"
  return $build
}


# AssemblyGitInfo.cs
$branch = & { git rev-parse --abbrev-ref HEAD }
"Branch: [$branch]"

$commitsRaw = & { set TZ=GMT; git log -999999 --date=raw --pretty=format:"%cd" }
$lines = $commitsRaw.Split([Environment]::NewLine)
$commitCount = $lines.Length
$commitDate = $lines[0].Split(" ")[0]
"Commit Counter: [$commitCount]"
"Commit Date: [$commitDate]"

"[assembly: Universe.AssemblyGitInfo(`"$branch`", $commitCount, $($commitDate)L)]" > AssemblyGitInfo.cs

# AssemblyInfo.cs
$version = GetVersion
$build = IncrementBuild
"[assembly: SystemReflection.AssemblyGitInfo(`"$version.$build.$commitCount`"]" > AssemblyInfo.cs

# AppGitInfo.json
$jsonInfo = @{
  Branch = $branch;
  CommitCount = $commitCount;
  CommitDate = [long]$commitDate;
  Version = "$version.$build.$commitCount"
}
SaveAsJson $jsonInfo "AppGitInfo.json"
Copy-Item "AppGitInfo.json" ..\sources\WindowsBootAnalyzer\ClientApp\src\AppGitInfo.json -Force