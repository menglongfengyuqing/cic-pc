@echo off
:: 设置压缩JS文件的根目录，脚本会自动按树层次查找和压缩所有的JS
SET JSFOLDER=D:\STS\cic-wap-v2-bak
echo del dir ....
rd/s/q %JSFOLDER%\js
echo xcopy Originaljs files to js ...
xcopy %JSFOLDER%\Originaljs %JSFOLDER%\js\ /e
echo del Originaljs dir ...
rd/s/q %JSFOLDER%\Originaljs
echo 完成!
pause & exit