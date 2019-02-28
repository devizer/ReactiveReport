powershell -f inject-git-info.ps1
dotnet build -v q && dotnet test --no-build -v n