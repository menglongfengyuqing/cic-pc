@echo off
:: 设置压缩JS文件的根目录，脚本会自动按树层次查找和压缩所有的JS
SET JSFOLDER=D:\STS\cic-wap-v2-bak
xcopy %JSFOLDER%\js %JSFOLDER%\Originaljs\ /e
echo finding js files.....
chdir /d %JSFOLDER%\js\
for /r . %%a in (*.js) do (
    @echo uglifyjs.... %%~a ...
    uglifyjs %%~fa  -m -o %%~fa
)
echo 完成!
pause & exit
