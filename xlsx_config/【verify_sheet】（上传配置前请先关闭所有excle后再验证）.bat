@echo off

REM 声明采用UTF-8编码
chcp 65001

echo ====start====
echo ====使用脚本前请先关闭所有excle文件====
echo ====此脚本暂只支持1级子目录检测，请不要增加2级子目录====
echo ====使用脚本前请配置excle主程序环境变量地址：C:\Program Files\Microsoft Office\root\Office16====
echo ====环境配置流程为：我的电脑→右键属性→高级→环境变量→选择系统变量Path→新增地址====

set dest1=【配置说明】.xlsm

echo %~dp0%dest1%

EXCEL.EXE %~dp0%dest1% /batOpen

echo ====Finish====

exit





