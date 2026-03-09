set WORKSPACE=.

set LUBAN_DLL=%WORKSPACE%\Tools\Luban\Luban.dll
set CONF_ROOT=%WORKSPACE%\DataTables
set CLIENT_ROOT=%WORKSPACE%\..\client

dotnet %LUBAN_DLL% ^
    -t client ^
    -c typescript-bin^
    -d bin^
    --conf %WORKSPACE%\luban.conf ^
    -x pathValidator.rootDir=%WORKSPACE%\Projects\Csharp_Unity_bin ^
    -x typescript-bin.outputCodeDir=%WORKSPACE%\output_client\code ^
    -x bin.outputDataDir=%WORKSPACE%\output_client\data ^
    -x bin.fileExt=bin ^
    -x codeStyle=none

if exist "%WORKSPACE%\configbin.bin" (
    del "%WORKSPACE%\configbin.bin"
)
"%WORKSPACE%\node\node.exe" packall.js

@echo off
if exist "%CLIENT_ROOT%" (
    if exist "%CLIENT_ROOT%\assets\config\configbin.bin" (
        del /Q "%CLIENT_ROOT%\assets\config\configbin.bin"
    )
    copy /Y "%WORKSPACE%\configbin.bin" "%CLIENT_ROOT%\assets\config\configbin.bin"
    xcopy "%WORKSPACE%\output_client\code\*" "%CLIENT_ROOT%\src\script\config" /Y /E /I /Q
)


pause