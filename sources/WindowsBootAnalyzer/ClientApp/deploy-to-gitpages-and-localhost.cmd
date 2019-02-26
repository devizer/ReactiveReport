@mkdir ..\bin 1>nul 2>&1

title [1/2] Build for github.io
set WebPackHomePage=https://devizer.github.io/ReactiveReport
type apply-homepage.ps1 | powershell -command -

call npm run build
pushd build
del ..\bin\devizer.github.io.zip
"C:\Program Files\7-Zip\7z" a ..\bin\devizer.github.io.zip 
popd

title [2/2] Build for localhost
set WebPackHomePage=http://localhost
type apply-homepage.ps1 | powershell -command -

call npm run build
pushd build
del ..\bin\localhost.zip 
"C:\Program Files\7-Zip\7z" a ..\bin\localhost.zip 
popd



set WebPackHomePage=.
type apply-homepage.ps1 | powershell -command -
