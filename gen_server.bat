set WORKSPACE=.

set LUBAN_DLL=%WORKSPACE%\Tools\Luban\Luban.dll
set CONF_ROOT=%WORKSPACE%\DataTables
set CLIENT_ROOT=%WORKSPACE%\..\..\minigame

dotnet %LUBAN_DLL% ^
    -t server ^
    -c lua-lua^
    -d lua ^
    --conf %WORKSPACE%\luban.conf ^
    -x pathValidator.rootDir=%WORKSPACE%\Projects\Csharp_Unity_bin ^
    -x lua-lua.outputCodeDir=%WORKSPACE%\output_server\code ^
    -x lua.outputDataDir=%WORKSPACE%\output_server\data ^
    -x bin.fileExt=bin ^
    -x codeStyle=none


@echo off

setlocal enabledelayedexpansion

REM 修正1：检查目录是否存在
if not exist "%WORKSPACE%\output_server\data\" (
    echo 错误：目录 "%WORKSPACE%\output_server\data\" 不存在！
    pause
    exit /b 1
)

REM 修正2：进入目录并检查是否成功
cd /d "%WORKSPACE%\output_server\data" 2>nul || (
    echo 无法进入目录 "%WORKSPACE%\output_server\data"
    pause
    exit /b 1
)

REM 修正3：遍历文件并添加重命名条件
for %%f in (*.lua) do (
    set "original_file=%%f"
    set "filename=%%~nf"

    REM 仅当原文件名不以 "config_" 开头时才重命名（避免重复处理）
    if /i "!filename:~0,7!" neq "config_" (
        echo 正在重命名: %%f → config_!filename!.lua
        ren "%%f" "config_!filename!.lua"
    ) else (
        echo 跳过已处理文件: %%f
    )
)


pause