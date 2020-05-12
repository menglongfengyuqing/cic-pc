var ctxpath = 'https://www.cicmorgan.com/svc/services'; //正式服务器

var reg = /^1[34578]\d{9}$/;
var regp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
var currentMobile; //当前输入手机号
var check = true; //是否勾选协议 默认勾选
var recommendRefer = getArgumentsByName("id");
var recommendRefer2 = getArgumentsByName("refer"); //合作方
// 中投摩根合作方注册入口参数refer.
var refer = $.cookie('refer');
if(refer == "" || refer == null) {
	refer = recommendRefer2;
}
$(function() {
	//获取图片验证码
	getPictureCode();

});
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

//发送短信验证码
function sendMessage() {
	//手机号码验证
	var mobile = $("#phone").val();
	if(!reg.test(mobile)) {
		getMsg("请输入正确的手机号码");
		return false;
	}
	$.ajax({
		url: ctxpath + "/verify/checkMobilePhoneIsRegistered",
		type: "post",
		dataType: "json",
		data: {
			mobilePhone: mobile,
			from: '1'
		},
		success: function(result) {
			if(result.state == "0") {
				getMsg(result.message);
				return false;
			} else {
				currentMobile = mobile;
				//验证图形验证码
				var code = $("#randCode").val();
				var key = $("#randkey").val();
				$.ajax({
					url: ctxpath + "/sm/checkPictureCode",
					type: "post",
					dataType: "json",
					data: {
						from: '1',
						key: key,
						pictureCode: code
					},
					success: function(result) {
						if(result.state == "0") {
							//向后台发送处理数据
							$.ajax({
								url: ctxpath + "/sm/newSendSmsCode",
								type: "post",
								dataType: "json",
								data: {
									mobilePhone: mobile,
									type: '1',
									from: '1',
									key: key,
									picturCode: code
								},
								success: function(result) {
									//console.log(result.data);
									if(result.state == "0") {
										interval();
									} else {
										getMsg(result.message);
										return false;
									}
								}
							});
						} else {
							getMsg("请输入正确的图形验证码");
						}
					}
				});
			}
		}
	});

}

//短信验证码倒计时
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount; //当前剩余秒数

function interval() {
	curCount = count;
	// 设置button效果，开始计时
	$("#phoneCodeBtn").attr("disabled", "true");
	$("#phoneCodeBtn").html("倒计时" + curCount + "S");
	InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次

	//	$(".code_msg").html("手机验证码已发送到"+mobile.substr(0,3)+"****"+mobile.substr(mobile.length-4,mobile.length));
}
//timer处理函数
function SetRemainTime() {
	if(curCount == 0) {
		window.clearInterval(InterValObj); //停止计时器
		$("#phoneCodeBtn").removeAttr("disabled"); //启用按钮
		$("#phoneCodeBtn").html("重新获取");
	} else {
		curCount--;
		$("#phoneCodeBtn").html("倒计时" + curCount + "S");
	}
}

//密码是否明文
$("#hidePwd_rs").click(function() {
	$(this).toggleClass("cur");
	pwdShow_rs();
});

function pwdShow_rs() {
	var type = $("#password").attr("type");
	var pwd = $("#password");

	if(type == "password") {
		$("#password").prop('type', 'text');
	} else {
		$("#password").prop("type", "password");
	}
}

//勾选协议
$(".inputRad").click(function() {

	if(check) {
		$("#checkBox").attr("checked", false);
		$(this).children("label").removeClass("cur");
		$("#checkNum").val(false);
		check = false;
		return;
	} else {

		$("#checkBox").attr("checked", "checked");
		$("#checkNum").val(true);
		$(this).children("label").addClass("cur");
		check = true;
	}

});
/**
 * 获取图形验证码
 */
function getPictureCode() {

	$.ajax({
		url: ctxpath + "/sm/getPictureCode",
		type: "post",
		dataType: "json",
		data: {
			from: '1'
		},
		success: function(result) {
			if(result.state == "0") {
				$("#randNum").val(result.pictureCode);
				$("#randkey").val(result.key);
			} else {
				console.log(result.message);
			}
		}
	});
}

//注册逻辑
$(".landing_login_btn").click(function() {
	var phone = $("#phone").val();
	var pwd = $("#password").val();
	var phoneCode = $("#phoneCode").val();
	var code = $("#randCode").val(); //图片验证码
	if(phone == "") {
		getMsg("请输入手机号");
		return false;
	} else if(!reg.test(phone)) {
		getMsg("请输入正确的手机号码");
		return false;
	} else {
		$.ajax({
			url: ctxpath + "/verify/checkMobilePhoneIsRegistered",
			type: "post",
			dataType: "json",
			data: {
				mobilePhone: phone,
				from: '1'
			},
			success: function(result) {
				if(result.state == "0") {
					getMsg(result.message);
					return false;
				} else {
					console.log(result.message);
				}
			}
		});

	}
	if(code == "") {
		getMsg("请输入图片验证码");
		return false;
	} else {

		var key = $("#randkey").val();
		$.ajax({
			url: ctxpath + "/sm/checkPictureCode",
			type: "post",
			dataType: "json",
			data: {
				from: '1',
				key: key,
				pictureCode: code
			},
			success: function(result) {
				if(result.state == "0") {

				} else {
					getMsg("请输入正确的图形验证码");
					return false;
				}
			}
		});
	}
	if(phoneCode == "") {
		getMsg("请输入短信证码");
		return false;
	}
	if(pwd == "") {
		getMsg("请输入密码");
		return false;
	}
	if(currentMobile != phone) {
		getMsg("非当前手机验证码，请重新获取！");
		return false;
	}

	if(pwd.length < 6 || !regp.test(pwd)) {
		getMsg("密码必须由至少6位的字母与数字组成");
		return false;
	} else if(check) {
		$.ajax({
			url: ctxpath + "/sm/verifySmsCode",
			type: "post",
			dataType: "json",
			data: {
				mobilePhone: phone,
				smsCode: phoneCode,
				from: '1'
			},
			success: function(result) {
				//console.log(result.message);
				if(result.state == "0") {
					//注册
					$.ajax({
						url: ctxpath + "/regist",
						type: "post",
						dataType: "json",
						data: {
							name: phone,
							pwd: pwd,
							from: '1',
							refer: refer
						},
						success: function(result) {
							if(result.state == "0") {
								$.cookie('token', result.token);
								window.location.href = "index.html";
							}
							if(result.state != "0") {
								getMsg(result.message);
							}
						}
					});
				} else {
					getMsg("短信验证码错误！");
				}
			}
		});
	} else {
		getMsg("请勾选服务协议！");
	}

});

function getMsg(str) {
	$(".error_msg").show().html(str);
}