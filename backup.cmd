for /f "delims=;" %%i in ('powershell -command "[System.DateTime]::Now.ToString(\"yyyy-MM-dd,HH-mm-ss\")"') DO set datetime=%%i

"C:\Program Files\7-Zip\7zG.exe" a -t7z -mx=9 -mfb=256 -md=256m -ms=on -xr!.git -xr!bin -xr!obj -xr!.vs -xr!packages -xr!coverage -xr!node_modules -xr!build ^
  "C:\Users\Backups on Google Drive\WindowsBootAnalyzer (%datetime%).7z" .
exit

dotnet build -c Debug --no-incremental WindowsBootInfo\WindowsBootInfo.sln
pushd WindowsBootInfo\bin\Debug
"C:\Program Files\7-Zip\7zG.exe" a -xr!*.json ..\WindowsBootInfo-Copy.7z .
popd
