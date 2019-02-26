@echo off
rd /q /s OfflinePrepare\bin 1>nul 2>&1
call build-only-legacy.cmd
pushd OfflinePrepare\bin\Debug
"C:\Program Files\7-Zip\7zG.exe" a -t7z -mx=9 -mfb=256 -md=256m -ms=on "..\BootLog-OfflinePrepare.7z" .
popd


