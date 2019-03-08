set NODE_ENV=production

set NODE_DISABLE_COLORS=1
pushd ..\..\..\build
call update-metadata.cmd 
popd

@mkdir ..\bin 1>nul 2>&1

title [1/2] Build for github.io
set WebPackHomePage=https://devizer.github.io/ReactiveReport
type apply-homepage.ps1 | powershell -command -

call npm run build
pushd build
del ..\bin\devizer.github.io.zip
"C:\Program Files\7-Zip\7z" a ..\bin\devizer.github.io.zip 
rd /q /s ..\..\..\..\docs\static 1>nul 2>&1
xcopy /y /E /R *.* ..\..\..\..\docs

popd

title [2/2] Build for localhost
set WebPackHomePage=http://192.168.0.16:88
type apply-homepage.ps1 | powershell -command -

call npm run build
pushd build
del ..\bin\localhost.zip 
"C:\Program Files\7-Zip\7z" a ..\bin\localhost.zip
set LOCAL_WEB=C:\inetpub\ReactiveReport
rd /q /s %LOCAL_WEB%\static 1>nul 2>&1
xcopy /y /E /R *.* %LOCAL_WEB%

popd


set WebPackHomePage=.
type apply-homepage.ps1 | powershell -command -

type src\AppGitInfo.json 