jQuery.support.cors = true;
//正式
var ctxpath = 'https://www.cicmorgan.com/svc/services'; //正式服务器
//    var ctxpath = 'http://182.92.114.130:8082/svc/services'; //测试服务器
//var ctxpath = 'http://192.168.1.93:8082/svc/services'; //chj测试服务器
//var ctxpath = 'http://192.168.1.11:8082/svc/services';
// var cgbpath = 'http://sandbox.firstpay.com/hk-fsgw/gateway';
var cgbpath = 'https://hk.lanmaoly.com/bha-neo-app/lanmaotech/gateway';
var server_path = "https://www.cicmorgan.com/";
//var server_path = "http://182.92.114.130:8080/";//测试服务器
//var server_path = "http://192.168.1.93:8080/";//chj测试服务器

var token = getArgumentsByName("token");
if(token == null || token == "null") {
	token = $.cookie('token');
} else {
	$.cookie("token", token);
}
/**
 * 描述: 根据参数名获取地址栏参数的值. <br>
 */
function getArgumentsByName(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null)
		return unescape(r[2]);
	return null;
}

/**
 * 用window.open()方法跳转至新页面并且用post方式传参
 * 懒猫2.0 接口，form post 请求方法， 
 * url:  网关类接口的url 
 *  */ 
function openPostWindow(result){
	
	var tempForm = document.createElement("form");
    tempForm.id = "tempForm1";
    tempForm.method = "post";
    tempForm.action = cgbpath;  // 懒猫网关接口
    tempForm.target="_blank"; //打开新页面
    // hideInput1
    var hideInput1 = document.createElement("input");
    hideInput1.type = "hidden";
    hideInput1.name="keySerial"; // 后台要接受这个参数来取值
    hideInput1.value = result.keySerial; // 后台实际取到的值
    tempForm.appendChild(hideInput1);
    // hideInput2
    var hideInput2 = document.createElement("input");
    hideInput2.type = "hidden";
    hideInput2.name="serviceName"; // 后台要接受这个参数来取值
    hideInput2.value = result.serviceName; // 后台实际取到的值
    tempForm.appendChild(hideInput2);
    // hideInput3
    var hideInput3 = document.createElement("input");
    hideInput3.type = "hidden";
    hideInput3.name="reqData"; // 后台要接受这个参数来取值
    hideInput3.value = result.reqData; // 后台实际取到的值
    tempForm.appendChild(hideInput3);
    // hideInput4
    var hideInput4 = document.createElement("input");
    hideInput4.type = "hidden";
    hideInput4.name="sign"; // 后台要接受这个参数来取值
    hideInput4.value = result.sign; // 后台实际取到的值
    tempForm.appendChild(hideInput4);
    // hideInput5
    var hideInput5 = document.createElement("input");
    hideInput5.type = "hidden";
    hideInput5.name="platformNo"; // 后台要接受这个参数来取值
    hideInput5.value = result.platformNo; // 后台实际取到的值
    tempForm.appendChild(hideInput5);
    if(document.all){
        tempForm.attachEvent("onsubmit",function(){});        //IE
    }else{
        var subObj = tempForm.addEventListener("submit",function(){},false);    //firefox
    }
    document.body.appendChild(tempForm);
    if(document.all){
        tempForm.fireEvent("onsubmit");
    }else{
        tempForm.dispatchEvent(new Event("submit"));
    }
    tempForm.submit();
    document.body.removeChild(tempForm);
}

Date.prototype.format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}
//校验项目是否过期   true过期  false不过期
function checkDate(startTime, endTime) {
	var start = startTime;
	var end;
	//  var start=new Date(startTime.replace("-", "/").replace("-", "/"));  
	if(endTime.indexOf("-") != -1) {
		end = endTime.replace("-", "").replace("-", "").replace(":", "").replace(":", "").replace(" ", "");
		if(end.indexOf("/") != -1) {
			end = end.replace("/", "").replace("/", "");
		}
	} else if(endTime.indexOf("/") != -1) {
		end = endTime.replace("/", "").replace("/", "").replace(":", "").replace(":", "").replace(" ", "");
		if(end.indexOf("-") != -1) {
			end = end.replace("-", "").replace("-", "");
		}
	}
	if(end < start) {
		return true;
	}
	return false;
}
//手机号验证
function checkMobile(str) {
	var re = /^1\d{10}$/;
	if(re.test(str)) {

		return "true";

	} else {
		return "false";
	}
}
//密码验证
function checkLoginPassword(str) {
	var regp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
	if(regp.test(str)) {
		if(str.length > 5 && str.length < 12) {
			return "true";
		} else {
			return "false";
		}
	} else {
		return "false";
	}
}

var refer = getArgumentsByName("refer");
if(refer != '' && refer != null) {
	$.cookie('refer', refer);
}

var userid = getArgumentsByName("id");
if(userid != '' && refer != userid) {
	$.cookie('userid', userid);
}
$(document).ready(function() {
	//nav model
	var header_wrap = ["<div class=\"top\">",
		"<div class=\"head\">",
		"	<div class=\"con_wrap \">",
		"		<div class=\"fl \">",
		"			<span class=\"kefu\">客服电话：400-666-9068</span>",
		"			<span>服务时间：9:00－21:00</span>",
		"			<a href=\"https://weibo.com/win11licai?is_all=1\" class=\"sina\" target=\"_blank\"></a>",
		"			<a href=\"javascript:;\" class=\"wechat\"><b></b></a>",
		"		</div>",
		"		<div class=\"fr\">",
		"			<ul>",
		"				<li class=\"user_sign\">",
		"					<a href=\"account_home.html\">您好,</a>",
		"					<span onclick=\"logout()\">[退出]</span>",
		"				</li>",
		"				<li>",
		"					<a href=\"https://v1.cicmorgan.com/index.html?token=" + token + "\" onclick=\"_czc.push([\'_trackEvent\', \'首页顶部\', \'点击\', \'返回旧版\'])\">返回旧版</a>",
		"				</li>",
		"				<li>",
		"					<a href=\"help_home.html\" onclick=\"_czc.push([\'_trackEvent\', \'首页顶部\', \'点击\', \'帮助中心\', ''])\">帮助中心</a>",
		"				</li>",
		"				<li>",
		"					<a href=\"zt_download.html\" onclick=\"_czc.push([\'_trackEvent\', \'首页顶部\', \'点击\', \'移动客户端\'])\">移动客户端</a>",
		"				</li>",
		"				<li class=\"sign_btn cur\">",
		"					<a href=\"javascript:;\" onclick=\"_czc.push([\'_trackEvent\', \'首页顶部\', \'点击\', \'签到\'])\">签到</a>",
		"				</li>",
		"			</ul>",
		"		</div>",
		"	</div>",
		"</div>",
		"<div class=\"nav clear\">",
		"	<div class=\"con_wrap\">",
		"		<div class=\"logo fl\">",
		"           <a href=\"index.html\" >",
		"			<img src=\"images/icon/logo.png\" onclick=\"_czc.push([\'_trackEvent\', \'首页导航栏\', \'点击\', \'logo\'])\"/>",
		"			</a>",
		"		</div>",
		"		<div class=\"fr\">",
		"			<div class=\"nav_li fl\">",
		"				<ul>",
		"					<li class=\"fl cur tab_index\">",
		"						<a href=\"index.html\" onclick=\"_czc.push([\'_trackEvent\', \'首页导航栏\', \'点击\', \'首页\'])\">首页</a>",
		"					</li>",
		"					<li class=\"fl tab_invest\">",
		"						<a href=\"invest_home.html\" onclick=\"_czc.push([\'_trackEvent\', \'首页导航栏\', \'点击\', \'我要出借\'])\">我要出借</a>",
		"					</li>",
		"					<li class=\"fl tab_integral_mall\">",
		"						<a href=\"integral_mall_home.html\" onclick=\"_czc.push([\'_trackEvent\', '\首页导航栏\', \'点击\', \'积分商城\'])\">积分商城</a>",
		"					</li>",
		"					<li class=\"fl tab_about\">",
		"						<a href=\"information_disclosure.html\" onclick=\"_czc.push([\'_trackEvent\', \'首页导航栏\', \'点击\', \'信息披露\'])\">信息披露</a>",
		"					</li>",
		"					<li class=\"fl tab_education\">",
		"						<a href=\"education_home.html\" id=\"education\" onclick=\"_czc.push([\'_trackEvent\', \'首页导航栏\', \'点击\', \'风险教育\'])\">风险教育</a>",
		"					</li>",
		"				</ul>",
		"			</div>",
		"			<div class=\"fr \">",
		"				<ul>",
		"					<li class=\"fl sign_btn_wrap\" onclick=\"_czc.push([\'_trackEvent\', \'首页导航栏\', \'点击\', \'注册/登录 我的账户\'])\">",
		"					</li>",
		"				</ul>",
		"			</div>",
		"		</div>",
		"	</div>",
		"</div>",
		"</div>"
	].join("");

	$("body").prepend(header_wrap);

	var foot_wrap = ["<div class=\"footer clear\">",
		"	<div class=\"con_wrap\">",
		"		<div class=\"foot_con\">",
		"			<div class=\"foot_ul fl\">",
		"				<ul class=\"font_size14 foot_ul_one\">",
		"					<li class=\"fl\"><b>友情链接</b></li>",
		"					<li class=\"fl\">",
		"						<a href=\"invest_home.html\" target=\"_blank\" onclick=\"_czc.push([\'_trackEvent\', \'首页底部区\', \'点击\', \'供应链金融\'])\">供应链金融</a>",
		"					</li>",
		"					<li class=\"fl\">",
		"						<a href=\"https://www.wdzj.com/\" rel=\"nofollow\" target=\"_blank\" onclick=\"_czc.push([\'_trackEvent\', \'首页底部区\', \'点击\', \'网贷之家\'])\">网贷之家</a>",
		"					</li>",
		"					<li class=\"fl\">",
		"						<a href=\"http://www.p2peye.com/\" rel=\"nofollow\" target=\"_blank\" onclick=\"_czc.push([\'_trackEvent\', \'首页底部区\', \'点击\', \'网贷天眼\'])\">网贷天眼</a>",
		"					</li>",
		"				</ul>",
		"				<ul class=\"font_size14 clear foot_ul_one\">",
		"					<li class=\"fl\"><b>安全保障</b></li>",
		"					<li class=\"fl \">",
		"						<a href=\"information_disclosure.html\" onclick=\"_czc.push([\'_trackEvent\', \'首页底部区\', \'点击\', \'信息披露\'])\">信息披露</a>",
		"					</li>",
		"					<li class=\"fl\">",
		"						<a href=\"information_about_us.html\" onclick=\"_czc.push([\'_trackEvent\', \'首页底部区\', \'点击\', \'关于我们\'])\">关于我们</a>",
		"					</li>",
		"					<li class=\"fl\">",
		"						<a href=\"information_announcement.html\" onclick=\"_czc.push([\'_trackEvent\', \'首页底部区\', \'点击\', \'网站公告\'])\">网站公告</a>",
		"					</li>",
		"					<li class=\"fl\">",
		"						<a href=\"information_media_coverage.html\" onclick=\"_czc.push([\'_trackEvent\', \'首页底部区\', \'点击\', \'媒体报道\'])\">媒体报道</a>",
		"					</li>",
		"					<li class=\"fl\">",
		"						<a href=\"help_home.html\" onclick=\"_czc.push([\'_trackEvent\', \'首页底部区\', \'点击\', \'帮助中心\'])\">帮助中心</a>",
		"					</li>",
		"				</ul>",
		"				<ul class=\"font_size14 foot_ul_two clear\">",
		"					<li class=\"fl\"><b>客服邮箱</b></li>",
		"					<li class=\"fl\">Kefu@cicmorgan.com </li>",
		"				</ul>",
		"				<ul class=\"font_size14 foot_ul_two clear\">",
		"					<li class=\"fl\"><b>市场合作</b></li>",
		"					<li class=\"fl\">Marketing@cicmorgan.com</li>",
		"				</ul>",
		"			</div>",
		"			<div class=\"cic_service fr\">",
		"				<div class=\"erweima fl\">",
		"					<dl class=\"fl\">",
		"						<dd>关注订阅号</dd>",
		"						<dt><img src=\"images/win_pc/ding.jpg\" class=\"fl\"> </dt>",
		"					</dl>",
		"					<dl class=\"fl\">",
		"						<dd>APP下载</dd>",
		"						<dt><img src=\"images/win_pc/code.png\" class=\"fr\"> </dt>",
		"					</dl>",
		"				</div>",
		"				<div class=\"kufu_info fl\">",
		"					<h3>400-666-9068</h3>",
		"					<p>工作日:9:00-21:00</p>",
		"					<p>周末:9:00-18:00</p>",
		"				</div>",
		"			</div>",
		"		</div>",
		"	</div>",
		"	<div class=\"copyright clear\">",
		"		<div class=\"con_wrap\">",
		"			<div class=\"font_size12\">",
		"				<a href=\"information_disclosure.html?icp\" target=\"_blank\">京ICP备14046134号&nbsp;&nbsp;&nbsp;京ICP证 161317号 &nbsp;&nbsp;&nbsp;公安机关备案号 11010802025329&nbsp;&nbsp;&nbsp;Copyright © 2014-2020 中投摩根信息技术（北京）有限责任公司 All Rights Reserved</a>",
		"			</div>",
		"			<div class=\"font_size12\">",
		"				<a href=\"zt_protocol_risk.html\" target=\"_blank\">市场有风险，出借需谨慎。</a>",
		"			</div>",
		"		</div>",
		"	</div>",
		"	<div class=\"honor_wrap\">",
		"		<div class=\"honor_con\">",
		"			<span class=\"span_img_01\" onclick=\"_czc.push([\'_trackEvent\', \'首页底部区\', \'点击\', \'icp备案查询\'])\"></span>",
		"			<span class=\"span_img_02\" onclick=\"_czc.push([\'_trackEvent\', \'首页底部区\', \'点击\', \'中国开发性金融促进会\'])\"></span>",
		"			<span class=\"span_img_03\" onclick=\"_czc.push([\'_trackEvent\', \'首页底部区\', \'点击\', \'生态联盟\'])\"></span>",
		"			<span class=\"span_img_04\" onclick=\"_czc.push([\'_trackEvent\', \'首页底部区\', \'点击\', \'网站备案信息\'])\"></span>",
		"			<span class=\"span_img_05\" onclick=\"_czc.push([\'_trackEvent\', \'首页底部区\', \'点击\', \'三级等保\'])\"></span>",
		"		</div>",
		"	</div>",
		"</div>"
	].join("");

	$("body").append(foot_wrap);

	var slider_nav = ["<div class=\"slider_nav\">",
		"	<ul class=\"font_size18\">",
		"		<li class=\"service_chat\">",
		"			<a href=\"https://a1.7x24cc.com/phone_webChat.html?accountId=N000000003539&chatId=43fea77f-27c5-4298-a73c-4291941961ce\" target=\"_blank\" onclick=\"_czc.push([\'_trackEvent\', \'首页悬浮区\', \'点击\', \'在线客服\'])\">",
		"				<i></i>",
		"				<span>在线<br />客服</span>",
		"			</a>",
		"		</li>",
		"		<li class=\"service_app\">",
		"			<a href=\"javascript:;\">",
		"				<i></i>",
		"				<span>APP<br />下载</span>",
		"			</a>",
		"			<div class=\"service_img\">",
		"				<p><img src=\"images/win_pc/code.png\"></p>",
		"			</div>",
		"		</li>",
		"		<li class=\"service_phone service_ic\">",
		"			<a href=\"javascript:;\"><i></i><span>计算<br />利息</span></a>",
		"			<div class=\"income_calculation\">",
		"				<h4><span class=\"ic_close\">X</span></h4>",
		"				<div class=\"income_calculation_con\">",
		"					<div class=\"ic_l fl\">",
		"						<h5>利息计算器</h5>",
		"						<div class=\"ic_input_group\">",
		"							<input type=\"text\" name=\"\" id=\"investAmount\" value=\"\" maxlength=\"8\" placeholder=\"输入出借金额\" onfocus=\"_czc.push([\'_trackEvent\', \'首页悬浮区\', \'输入\', \'利息计算器\'])\"/>",
		"							<label>元</label>",
		"						</div>",
		"						<div class=\"ic_input_group\">",
		"							<input type=\"text\" name=\"\" id=\"investSpan\" value=\"\" maxlength=\"4\" placeholder=\"输入出借期限\" />",
		"							<label>日</label>",
		"						</div>",
		"						<div class=\"ic_input_group\">",
		"							<input type=\"text\" name=\"\" id=\"investRate\" value=\"\" maxlength=\"5\" placeholder=\"输入年化利率\" />",
		"							<label>%</label>",
		"						</div>",
		"					</div>",
		"					<div class=\"ic_r fl\">",
		"						<h5>计算结果</h5>",
		"						<ul>",
		"							<li id=\"sumIncome\">总共利息:¥0000</li>",
		"							<li id=\"perIncome\">每月利息:¥0000</li>",
		"							<li id=\"sumAmount\">本息合计:¥0000</li>",
		"						</ul>",
		"					</div>",
		"					<div class=\"ic_error\">错误</div>",
		"					<div class=\"ic_btn clear\" id=\"countIncome\">计算利息</div>",
		"				</div>",
		"				<div class=\"ic_msg\">",
		"					<p>-按日计息&nbsp;&nbsp;按月付息&nbsp;&nbsp;到期还本-</p>",
		"					<h5>利息仅供参考,具体利息以实际到账为准</h5>",
		"				</div>",
		"			</div>",
		"		</li>",
		"		<li class=\"service_back\" onclick=\"goTop()\">",
		"			<a href=\"javascript:;\"><i></i><span>返回<br />顶部</span></a>",
		"		</li>",
		"	</ul>",
		"</div>"
	].join("");

	$("body").append(slider_nav);

	var sign_wrap = ["<div class=\"mask_wrap\"></div>",
		"<div class=\"sign_mask\">",
		"<div class=\"sign_con\">",
		"<p class=\"font_size24\" id=\"sign_integral_count\" ></p>",
		"<p class=\"font_size24\" id=\"sign_total\" ></p>",
		"</div>",
		"</div>",
	].join("");
	$("body").append(sign_wrap);

	//导航 判断当前子类
	var flagUrls = location.href;
	if(flagUrls.indexOf('index.html') > -1 || flagUrls.indexOf('www.cicmorgan.html') > -1) {
		$(".tab_index").addClass("cur").siblings("li").removeClass("cur");
	} else {
		$(".tab_index").removeClass("cur");
	}
	if(flagUrls.indexOf('invest') > -1) {
		$(".tab_invest").addClass("cur").siblings("li").removeClass("cur");
	}
	if(flagUrls.indexOf('integral_mall') > -1) {
		$(".tab_integral_mall").addClass("cur").siblings("li").removeClass("cur");
	}

	if(flagUrls.indexOf('information') > -1) {
		$(".tab_about").addClass("cur").siblings("li").removeClass("cur");
	}
	if(flagUrls.indexOf('education') > -1) {
		$(".tab_education").addClass("cur").siblings("li").removeClass("cur");
	}

	//获取签到状态
	$.ajax({
		url: ctxpath + "/user/getUserInfo",
		type: "post",
		dataType: "json",
		data: {
			from: '2',
			token: token
		},
		success: function(result) {
			if(result.state == '0') {
				var signed = result.data.signed;
				if(signed == "3") {
					$(".sign_btn a").text("签到");
				} else if(signed == "2") {
					$(".sign_btn a").text("已签到");
				}

				var user = result.data;
				var phoneNum = user.name.substr(0, 3) + '****' + user.name.substr(7);
				var name = user.realName != '' ? user.realName : phoneNum;
				$(".user_sign").css("visibility","visible");
				$(".user_sign").children("a").html("您好," + name);
				$(".sign_btn_wrap").addClass("account_li").html("<a href='account_home.html'>我的账户</a>");

			} else {
				$.cookie('token', null);
				$(".sign_btn_wrap").html("<a href='login.html'>登录</a><span>|</span><a href='register.html'>注册</a>");
			}

		}
	});
	$(".service_ic a").click(function() {
		$(".income_calculation").show();
		$("#investAmount").val(""); //出借金额
		$("#investSpan").val(""); //出借期限
		$("#investRate").val(""); //出借利率
		$("#sumIncome").html("总共利息:¥0.00");
		$("#perIncome").html("每月利息:¥0.00");
		$("#sumAmount").html("本息合计:¥0.00");
	});
	$(".ic_close").click(function() {
		$(".income_calculation").hide();
	})
	//利息计算器
	$("#countIncome").click(function() {
		$(".ic_error").hide();
		var regIncome = /^\d{0,9}$/;
		var investAmount = $("#investAmount").val(); //出借金额
		var investSpan = $("#investSpan").val(); //出借期限
		var investRate = $("#investRate").val(); //出借利率
		//判断是否为空
		if(investAmount == "") {
			$(".ic_error").show().html("请输入出借金额");
			return false;
		}
		if(!regIncome.test(investAmount)) {
			$(".ic_error").show().html("请输入正确出借金额");
			return false;
		}
		if(investSpan == "") {
			$(".ic_error").show().html("请输入出借期限");
			return false;
		}
		if(!regIncome.test(investSpan)) {
			$(".ic_error").show().html("请输入正确出借期限");
			return false;
		}
		if(investRate == "") {
			$(".ic_error").show().html("请输入出借利率");
			return false;
		}
		var dayIncome = investAmount * investRate / 36500;
		dayIncome = dayIncome.toFixed(2);
		//		dayIncome = formatCurrency(dayIncome); //格式化利息（每日利息）
		var sumIncome = dayIncome * investSpan; //总利息
		$("#sumIncome").html("总共利息:¥" + formatCurrency(sumIncome));
		var perIncome = dayIncome * 30; //每月利息
		$("#perIncome").html("每月利息:¥" + formatCurrency(perIncome));
		var sumAmount = parseFloat(sumIncome) + parseFloat(investAmount); //本息合计
		$("#sumAmount").html("本息合计:¥" + formatCurrency(sumAmount));
	})

	/**
	 * 签到点击事件
	 */
	$(".sign_btn").click(function() {
		$.ajax({
			url: ctxpath + "/signed/userSigned",
			type: "post",
			dataType: "json",
			data: {
				from: '1',
				token: token
			},
			success: function(result) {
				if(result.state == "4") {
					$.cookie('token', null);
					window.location.href = "login.html";
					return false;
				}
				if(result.state == "0") {
					if(result.data.signed == "1") {

						$(".mask_wrap,.sign_mask").show();

						$("#sign_total").html("累计签到<span>" + result.data.continuousTime + "</span>天");

						$("#sign_integral_count").html("恭喜您获得<span>" + result.data.integral + "</span>个积分");

						// 文字回显.
						$(".sign_btn a").text("已签到");

						// 弹框提示.
					} else if(result.data.signed == "2") {
						$(".sign_mask").addClass("cur");
						$(".mask_wrap,.sign_mask").show();
						// 弹框内容.

						$("#sign_integral_count").html("当前积分<span>" + result.data.integralCount + "</span>分");
						$("#sign_total").html("累计签到<span>" + result.data.continuousTime + "</span>天");

						$("#sign_grade").hide();
						// 文字回显.
						$(".sign_btn a").text("已签到");

					} else if(result.data.signed == "5") {}
				}

			}
		});
	});

	$(".mask_wrap,.sign_mask").click(function() {
		$(".mask_wrap,.sign_mask,.code_num").hide();
	});

});

// 退出登录
function logout() {
	//	_czc.push(['_trackEvent', '首页顶部', '点击', '退出按钮']);
	$.cookie('token', null);
	$(".sign_wrap ul").show();
	$(".sign_wrap div").hide();
	window.location.href = "login.html";
}

//回到顶部

function goTop() {

	$('html,body').animate({
		'scrollTop': 0
	}, 600);
}

/**
 * 格式化金额
 * @param {Object} num
 */
function formatCurrency(num) {
	num = num.toString().trim();
	if(isNaN(num))
		num = "0";
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(num * 100 + 0.50000000001);
	cents = num % 100;
	num = Math.floor(num / 100).toString();
	if(cents < 10)
		cents = "0" + cents;
	for(var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
		num = num.substring(0, num.length - (4 * i + 3)) + ',' +
		num.substring(num.length - (4 * i + 3));
	return(((sign) ? '' : '-') + num + '.' + cents);
}
//将当前时间转换成yyyymmddhhmmss格式
function timeStamp2String() {
	var datetime = new Date();
	//  datetime.setTime(time);  
	var year = datetime.getFullYear();
	var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
	var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
	var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
	var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
	var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
	return year.toString() + month.toString() + date.toString() + hour.toString() + minute.toString() + second.toString();
}

/*ie8 、兼容模式下 trim方法*/
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, '');
}
var _hmt = _hmt || [];
(function() {
	var hm = document.createElement("script");
	hm.src = "https://hm.baidu.com/hm.js?c2657abeeb82cdfb771a72b76314650b";
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(hm, s);
})();

var body_src = document.getElementsByTagName('body')[0];
var script = document.createElement('script');
var box = document.createElement("div");
script.type = 'text/javascript';
script.onload = script.onreadystatechange = function() {
	if(!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {

		// Handle memory leak in IE 
		script.onload = script.onreadystatechange = null;
	}
};
//script.src= 'https://s4.cnzz.com/z_stat.php?id=1261944151&web_id=1261944151'; //运营数据
script.src = 'https://s13.cnzz.com/z_stat.php?id=1273656825&web_id=1273656825'; //埋点 正式
//script.src = 'https://s22.cnzz.com/z_stat.php?id=1273708319&web_id=1273708319"'; //埋点 测试
box.style.visibility = "hidden";
box.appendChild(script);
body_src.appendChild(box);