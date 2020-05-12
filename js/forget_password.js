jQuery.support.cors = true;
var mobile;
var reg = /^1[34578]\d{9}$/;
var regp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
var isMobile = false;
var isCode = false;
var isPwd = false;
var click = false;
$(function() {
	getPictureCode();

});

function nextStep() {
	mobile = $("#mobile").val();

	var code = $("#code").val();
	var key = $("#codeKey").val();
	var phoneCode = $("#phoneCode").val();
	if(mobile == null || mobile.trim() == "") {
		getMsg("手机号不能为空");

		return false;
	} else if(!reg.test(mobile)) {
		getMsg("请输入正确的手机号");
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
			if(result.state == '5') { //已注册

				getMsg("用户名或密码错误");
				return false;
			} else if(result.state == "0") {

				currentMobile = mobile;
				//验证图形验证码
				var code = $("#code").val();
				var key = $("#codeKey").val();
				if(code == null || code == "") {
					getMsg("图形验证码不能为空");
					return false;
				} else {
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
								if(phoneCode == "") {
									getMsg("短信验证码不能为空");
									return false;
								} else {
									$.ajax({
										url: ctxpath + "/sm/verifySmsCode",
										type: "post",
										dataType: "json",
										data: {
											mobilePhone: mobile,
											smsCode: phoneCode,
											from: '1'
										},
										success: function(result) {
											if(result.state == "0") {
												$(".phone_step_one").remove();
												$(".phone_step_two").show();

											} else {
												getMsg("请输入正确的短信验证码");
												return false;
											}
										}
									});
								}
							} else {
								getMsg("请输入正确的图形验证码");
								return false;

							}
						}
					});
				}
			} else {
				getMsg(result.message);
			}
		}
	});
}
/**
 * 获取图形验证码
 */
function getPictureCode() {

	$.ajax({
		url: ctxpath + "/sm/getPictureCode",
		type: "post",
		dataType: "json",
		data: {
			from: '2'
		},
		success: function(result) {
			if(result.state == "0") {
				$("#pictureCodeR").val(result.pictureCode);
				$("#codeKey").val(result.key);
			}
		}
	});
}

/*获取验证码倒计时*/
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount; //当前剩余秒数

function sendMessage() {
	var mobile = $("#mobile").val();
	var code = $("#code").val();
	var key = $("#codeKey").val();
	var phoneCode = $("#phoneCode").val();
	//手机号码验证

	if(mobile == null || mobile.trim() == "") {
		getMsg("手机号不能为空");
		return false;
	} else if(!reg.test(mobile)) {
		getMsg("请输入正确的手机号");
		return false;
	}
	if(click) {
		return false;

	} else {
		$.ajax({
			url: ctxpath + "/verify/checkMobilePhoneIsRegistered",
			type: "post",
			dataType: "json",
			data: {
				mobilePhone: mobile,
				from: '1'
			},
			success: function(result) {
				if(result.state == "5") {
					getMsg("用户名输入错误");
					return false;
				} else {
					currentMobile = mobile;

					if(code == null || code == "") {
						getMsg("图形验证码不能为空");
						return false;
					} else {
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

											if(result.state == "0") {
												interval();
												
											} else {
												getMsg(result.message);
												return false;

											}
											click = true;
										}
									});

								} else {
									getMsg("请输入正确的图形验证码");
									return false;
								}
							}
						});
					}
				}
			}
		});
		click = true;
	}
}

function interval() {

	curCount = count;
	// 设置button效果，开始计时
	$("#btnSendCode").attr("disabled", "true");
	$("#btnSendCode").addClass("default").html("倒计时" + curCount + "S");
	InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
}

//timer处理函数
function SetRemainTime() {
	if(curCount == 0) {
		window.clearInterval(InterValObj); //停止计时器
		$("#btnSendCode").removeAttr("disabled"); //启用按钮
		$("#btnSendCode").html("重新获取").removeClass("default");
		click = false;
	} else {
		curCount--;
		$("#btnSendCode , #btnSendCode02 ,#btnSendCode03").html("倒计时" + curCount + "S");
	}
}

//确定修改密码
function updatePwd() {
	var pwd = $("#pwd").val();
	var pwdRepeat = $("#pwdRepeat").val();
	//密码校验
	if(pwd == null || pwd == "") {
		getMsg("密码不能为空");
		return false;
	} else if(!regp.test(pwd)) {
		getMsg("密码格式为6-16位数字加字母");
		return false;
	}
	if(pwdRepeat == "" || pwdRepeat == null) {
		getMsg("密码不能为空");;
		return false;
	} else if(!regp.test(pwdRepeat)) {
		getMsg("密码格式为6-16位数字加字母");
		return false;
	} else if(pwdRepeat != pwd) {
		getMsg("两次输入的密码必须一致");
		return false;
	}
	pwd = str_md5(pwd);
	pwd = $.base64.encode(pwd);
	//更新密码
	$.ajax({
		url: ctxpath + "/newForgetPassword",
		type: "post",
		dataType: "json",
		data: {
			name: mobile,
			pwd: pwd,
			from: '2'
		},
		success: function(result) {
			if(result.state == "0") {
				//更新成功
				$(".setting_phone_step").remove();
				$(".forget_success").show();
				var counts = 3;
				setInterval(function() {
					counts--;
					$("#second").html(counts);
					if(counts == 0) {
						logout();
						window.location.href = 'index.html';
					}
				}, 1000);

			}
		}
	});

}

function getMsg(str) {

	$(".mask_tip").show().html(str);
	setTimeout(function() {
		$(".mask_tip").hide();
	}, 2000);
}