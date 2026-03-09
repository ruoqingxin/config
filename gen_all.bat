@echo off
echo 正在执行第一个 BAT 文件...
call gen_client.bat
echo 第一个 BAT 文件执行完毕！

echo 正在执行第二个 BAT 文件...
call gen_server.bat
echo 第二个 BAT 文件执行完毕！

echo 所有脚本执行完成！