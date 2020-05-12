#!/bin/sh
export LC_CTYPE="zh_CN.UTF-8"
project_dir="$1"
echo "del ${project_dir}/js "
rm "${project_dir}/js" -rf
if [ -d "${project_dir}/js" ];then
	echo "js dir not exists"
else
	echo "cp ${project_dir}/Originaljs to ${project_dir}/js/"
	cp -arf ${project_dir}/Originaljs ${project_dir}/js/
        if [ -d "${project_dir}/js" ];then
		echo "cp completed,   del Originaljs dir"
		rm "${project_dir}/Originaljs" -rf 
	fi	
fi 

