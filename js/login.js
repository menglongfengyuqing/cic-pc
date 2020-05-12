var recommendRefer = getArgumentsByName("id");
var recommendRefer2 = getArgumentsByName("refer"); //合作方
var reg = /^1[123456789]\d{9}$/;
var currentMobile;
var regp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
var userNo;
$(function() {
	$(".footer").hide();
})

//登录
function login() {
//	_czc.push(['_trackEvent', '登录页面-登录按钮', '点击', '登录']);
	$(".error_msg").html("");
	var mobile = $("#mobile").val();
	var pwd = $("#pwd").val();

	if(mobile == "") {
		$(".error_msg").show().html("手机号不能为空");
		return false;
	}
	if(!reg.test(mobile)) {
		$(".error_msg").show().html("请输入正确的手机号");
		return false;
	} else {

		$.ajax({
			url: ctxpath + "/verify/checkMobilePhoneIsRegistered",
			type: "post",
			dataType: "json",
			data: {
				mobilePhone: mobile,
				from: '2'
			},
			success: function(result) {
				//console.log(result.message);
				if(result.state == "5") {
					//$(".error_msg").show().html('该手机号尚未注册');
					$(".error_msg").show().html("用户名或密码错误");
					return false;
				} else if(result.state == "0") {
					$(".error_msg").hide();
					if(pwd == "") {
						$(".error_msg").show().html("密码不能为空");
						return false;
					} else {

						if($("#agreementLogin").prop("checked") != true) {
							$(".error_msg").show().html("请您勾选用户服务协议！");
							return false;
						}
						pwd = str_md5(pwd);
						pwd = $.base64.encode(pwd);

						$.ajax({
							url: ctxpath + "/newLogin",
							type: "post",
							dataType: "json",
							data: {
								from: 2,
								mobile: mobile,
								pwd: pwd
							},
							success: function(result) {
								if(result.state == 0) {
									if(result.certificateChecked == 2 && result.isActivate =='FALSE'){
										$.ajax({
											url: ctxpath + "/lanmaoAccount/memberActivation",
											type: "post",
											dataType: "json",
											data: {
												from: '1',//1:表示为出借人解绑 2：表示为借款人解绑
												token: result.token
											},
											success: function(result1) {
												if(result1.state == 0) {
													var obj =  result1.data;
													openPostWindow(cgbpath, obj);
													//执行完跳转到首页
													window.location.href = 'login.html';
												} else {
													$.cookie("token", '');
													console.log(result1.message);
													$(".error_msg").show().html(result1.message);
//													logout();
												}
											}
										});
										
									}else{
										$.cookie("token", result.token);
										$(".error_msg").hide();
										var uri = document.referrer;
										var arrurl = uri.split('/');
										//									console.log(arrurl[arrurl.length - 1]);
										if(arrurl[arrurl.length - 1] == "register.html" || arrurl[arrurl.length - 1] == "") {
											window.location.href = 'index.html';
										} else {
											window.history.go(-1);
										}
									}
									
								} else {
									$(".error_msg").show().html(result.message);
								}
							}
						})
					}
				}
			}
		});
	}
}

// 用window.open()方法跳转至新页面并且用post方式传参
function openPostWindow(url, result){
	
	var tempForm = document.createElement("form");
    tempForm.id = "tempForm1";
    tempForm.method = "post";
    tempForm.action = url;
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


$("#hidePwd").click(function() {
	$(this).toggleClass("cur");
	pwdShow();
});
/** 登录显示/隐藏密码*/

function pwdShow() {
	var type = $("#pwd").attr("type");
	if(type == "password") {
		$("#pwd").get(0).setAttribute("type", "text");
	} else {
		$("#pwd").get(0).setAttribute("type", "password");
	}
}
// 绑定键盘按下事件
$(document).keypress(function(e) {
	// 回车键事件
	if(e.which == 13) {
		login();
	}
});
$(".login_ul ul li input").focus(function() {
	$(this).parent("li").addClass("cur");
}).blur(function() {
	$(this).parent().removeClass("cur");
});
var flagCheck = false;
/*复选框切换*/
$(".agreement span").click(function() {

	$(this).toggleClass("cur");
	if($(this).hasClass('cur')) {
		$("#agreementLogin").attr("checked", true);

	} else {
		$("#agreementLogin").attr("checked", false);

	}

});