set DOTNET_SYSTEM_NET_HTTP_USESOCKETSHTTPHANDLER=0
setx DOTNET_SYSTEM_NET_HTTP_USESOCKETSHTTPHANDLER 0
pushd WindowsBootAnalyzer\ClientApp
rem call npm install
popd
pushd
dotnet publish -c Release -o bin\published --self-contained -r win-x64 /v:n
popd
rem dotnet publish -c Debug bin\Debug
