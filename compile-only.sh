set -e
work=$HOME
if [ -d "/ssd" ]; then work=/ssd; fi;
work=$work/builds/ReactiveReport
pushd $HOME
rm -rf $work >/dev/null 2>&1 || true
mkdir -p $(dirname $work)
cd $(dirname $work)
git clone https://github.com/devizer/ReactiveReport
cd ReactiveReport/sources

git pull
nuget restore

pushd OfflinePrepare
msbuild /v:n /p:Configuration=Release /t:Rebuild OfflinePrepare.csproj
popd

pushd WindowsBootAnalyzer
cd ClientApp; npm install; cd ..
if [[ $(uname -m) == armv7* ]]; then rid=linux-arm; else rid=linux-arm64; fi; if [[ "$(uname -m)" == "x86_64" ]]; then rid=linux-x64; fi; echo ".NET Core runtime identifier: $rid"
dotnet publish --self-contained -r $rid -c Release -o bin/public WindowsBootAnalyzer.csproj
popd

popd
