@echo off
setlocal
set WORKSPACE=%~dp0
set DOTNET=%WORKSPACE%..\ .dotnet\dotnet.exe
set DOTNET=%DOTNET: =%
set LUBAN_DLL=%WORKSPACE%Tools\Luban\Luban.dll

if not exist "%DOTNET%" (
    echo Missing local .NET runtime: %DOTNET%
    exit /b 1
)

"%DOTNET%" "%LUBAN_DLL%" ^
    -t client ^
    -c typescript-bin ^
    -d bin ^
    --conf "%WORKSPACE%luban.conf" ^
    -x pathValidator.rootDir="%WORKSPACE%Projects\Csharp_Unity_bin" ^
    -x typescript-bin.outputCodeDir="%WORKSPACE%output_client\code" ^
    -x bin.outputDataDir="%WORKSPACE%output_client\data" ^
    -x bin.fileExt=bin ^
    -x codeStyle=none

if errorlevel 1 exit /b %errorlevel%
"%WORKSPACE%node\node.exe" "%WORKSPACE%packall.js"
endlocal
