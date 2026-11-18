@echo off
setlocal
cd /d "%~dp0"
set "CLIENT_ROOT=%~dp0..\ItemChangeWorld"
if exist "output_client\data\*.bin" del /q "output_client\data\*.bin"
dotnet Tools\Luban\Luban.dll -t client -c typescript-bin -d bin --conf luban.conf -x typescript-bin.outputCodeDir=output_client/code -x bin.outputDataDir=output_client/data -x bin.fileExt=bin -x codeStyle=none
if errorlevel 1 exit /b 1
"%~dp0node\node.exe" "%~dp0packall.js"
if errorlevel 1 exit /b 1
if not exist "%CLIENT_ROOT%\assets\config" exit /b 1
copy /y "configbin.bin" "%CLIENT_ROOT%\assets\config\configbin.bin" >nul
if errorlevel 1 exit /b 1
copy /y "output_client\code\schema.ts" "%CLIENT_ROOT%\src\script\config\schema.ts" >nul
if errorlevel 1 exit /b 1
endlocal
