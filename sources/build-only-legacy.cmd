type Prepare-NuGet-And-build-tools.ps1 | powershell -c -
call ~local-build-tools.cmd
"%NUGET_EXE%" restore
"%MSBUILD_EXE%" WindowsBootAnalyzer.sln /t:Rebuild /v:m /p:Configuration=Debug
"%MSBUILD_EXE%" WindowsBootAnalyzer.sln /t:Rebuild /v:m /p:Configuration=Release
