/**
 * 格式化日期
 * 	var time1 = new Date().Format("yyyy-MM-dd");
 * 	var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");
 * @param {Object} fmt
 */

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}




/**
 * 两个日期比较大小
 *  参数格式 ： yyyy-MM-dd hh:mm:ss
 * 	对于2011-10-10 00:10:26时间类型格式进行比较： 
 */
function compareTo(beginTime, endTime){  
    var beginTimes = beginTime.substring(0,10).split('-');  
    var endTimes   =  endTime.substring(0,10).split('-');  
    beginTime = beginTimes[1]+'-'+beginTimes[2]+'-'+beginTimes[0]+' '+beginTime.substring(10,19);  
    endTime    = endTimes[1]+'-'+endTimes[2]+'-'+endTimes[0]+' '+endTime.substring(10,19);  
    var a =(Date.parse(endTime)-Date.parse(beginTime))/3600/1000;  
    if(a <= 0){  
        return false;  
    } else {
    	return true;
    }  
} 