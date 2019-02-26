pushd WindowsBootAnalyzer\ClientApp
call npm install
popd
pushd
dotnet publish -c Release -o bin\published --self-contained -r win-x64
popd
rem dotnet publish -c Debug bin\Debug
