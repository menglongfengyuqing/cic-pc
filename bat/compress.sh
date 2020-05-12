#!/bin/sh
export LC_CTYPE="zh_CN.UTF-8"
# $0 publish dir; $1 public projectname
project_dir="$1"
if [ -d ${project_dir} ];then
    cp -arf ${project_dir}/js ${project_dir}/Originaljs/
    for file in `ls ${project_dir}/js/` 
    do 
	if [ -d "${project_dir}/js/$file" ];then
	   echo "diris not operation"
	else
	   echo ${project_dir}"/js/"$file
	   uglifyjs "${project_dir}/js/$file" -m -c -o "${project_dir}/js/$file"
	   echo uglifyjs completed;
	fi
    done
fi

