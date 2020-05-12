var name;
var click = false;
var reg = /^1[34578]\d{9}$/;
var regp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
$(function() {
	var state = getArgumentsByName("state");
	if(state == null || state == "") {
		$("#mailTit").html("绑定邮箱");
		$(".setting_mail_wrap").hide();
		$(".phone_step").hide();
		$(".setting_mail_success ").show();
		$(".phone_step_three").show();
		$(".setting_phone_tab").hide();
		// 获取validateCode
		var validateCode = getArgumentsByName("validateCode");
		var userCode = getArgumentsByName("userCode");

		if(validateCode == null || validateCode.length == "") {

			getMsg("邮箱校验失败！");
			$(".modify_mail").show();
			return false;
		}
		if(userCode == null || userCode.length == "") {

			getMsg("邮箱校验失败！");
			$(".modify_mail").show();
			return false;
		}

		$.ajax({
			url: ctxpath + "/checkEmailCode",
			type: "post",
			dataType: "json",
			data: {
				from: '1',
				checkCode: validateCode,
				userId: userCode,
				token: token
			},
			success: function(result) {
				if(result.state = "0") {
					$(".modify_mail").show();
					$(".setting_mail_success").show();
				}
			}
		});
	} else {
		if(state == 1) {
			$("#mailTit").html("绑定邮箱");
		} else if(state == 2) {
			$("#mailTit").html("修改邮箱");
			$(".setting_mail_wrap").hide();
			$(".modify_mail").show();
			getPictureCode();

		}
		$.ajax({
			url: ctxpath + "/user/getUserInfo",
			type: 'post',
			dataType: 'json',
			data: {
				from: '1',
				token: token
			},
			success: function(result) {
				if(result.state == 4) {
					//				logout();
				}
				if(result.state == '0') {
					name = result.data.name;
					var nameSub = name.replace(name.substr(3, 4), "****");
					$('#mobile').val(nameSub);
				}
			}
		});

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
			from: '2'
		},
		success: function(result) {
			if(result.state == "0") {
				$("#pictureCodeR").html(result.pictureCode);
				$("#codeKey").val(result.key);
			}
		}
	});
}

/*****************  发送验证码并校验   ******************************************/
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount; //当前剩余秒数
function sendMessage() {
	var mobile = name;
	var code = $("#code").val();
	var key = $("#codeKey").val();
	if(click) {
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
								click=false;
								return false;

							}
							click = true;
						}
					});

				} else {
					getMsg("请输入正确的图形验证码");
					click=false;
					return false;
				}
			}
		});
		click = true;
	}
}

function interval() {
	curCount = count;
	// 设置button效果，开始计时
	$("#getCode").attr("disabled", "true");
	$("#getCode").addClass("default").html("倒计时" + curCount + "S");
	InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
}

//timer处理函数
function SetRemainTime() {
	if(curCount == 0) {
		window.clearInterval(InterValObj); //停止计时器
		$("#getCode").removeAttr("disabled"); //启用按钮
		$("#getCode").html("重新获取").removeClass("default");
		click = false;
	} else {
		curCount--;
		$("#getCode").html("倒计时" + curCount + "S");
	}
}

//修改邮箱 下一步
$("#nextStep").click(function() {
	var mobileMessage = $("#mobileMessage").val();
	if(mobileMessage != "") {
		$("#nextStep").addClass("active");
	} else {
		$("#nextStep").removeClass("active");
		return false;
	}
	if(mobileMessage == null || mobileMessage.trim() == "") {
		getMsg("请输入验证码!");

		return;
	}
	checkCode(name, mobileMessage)
})

/******************** 校验短信验证码是否正确 **********************/
function checkCode(mobile, code) {
	$.ajax({
		url: ctxpath + "/sm/verifySmsCode",
		type: "post",
		dataType: "json",
		data: {
			mobilePhone: mobile,
			smsCode: code,
			from: '1'
		},
		success: function(result) {
			if(result.state == "0") {
				$(".phone_step_one").hide();
				$(".phone_step_two").show();
				$(".error_msg").hide();
			} else {
				getMsg("验证码错误!");
				$(".error_msg").show();
			}
		}
	});
}

//绑定邮箱
$("#bind_mail_btn").click(function(event) {
	$(".error_msg").hide();
	var email = $("#bind_email").val();
	if(email != "") {
		$("#bind_mail_btn").addClass("active");
	} else {
		$("#bind_mail_btn").removeClass("active");
		return false;
	}
	bindEmail(email, "checkBindEmailMsg")
});

//修改邮箱
$("#bind_email_end").click(function() {
	var newEmail = $("#newEmail").val();
	if(newEmail != "") {
		$("#bind_email_end").addClass("active");
	} else {
		$("#bind_email_end").removeClass("active");

		return false;
	}
	bindEmail(newEmail, "checkChangeEmailMsg")
})

//检查邮箱格式
function checkMailStr(str) {
	var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if(reg.test(str)) {
		return "true";
	} else {
		return "false";
	}
}

// 绑定邮箱公共方法
function bindEmail(email, buttonId) {
	if(email == "") {
		getMsg("请输入邮箱地址!");

	} else {
		if(checkMailStr(email) == 'false') {
			getMsg("请输入正确的邮箱地址!");

		} else {
			$(".error_msg").hide();
			$.ajax({
				url: ctxpath + "/user/sendCheckEmail",
				type: "post",
				dataType: "json",
				data: {
					email: email,
					token: token,
					from: '1'
				},
				success: function(result) {
					if(result.state == "0") {
						if(buttonId == "checkBindEmailMsg") { // 绑定
							$(".setting_mail_con").hide();
							$(".setting_mail_success").show();
						} else { // 修改
							$(".phone_step_one").hide();
							$(".phone_step_one,.phone_step_two").hide();
							$(".phone_step_three").show();
							$(".setting_mail_success").show();
						}
					} else {
						getMsg(result.message);

					}
				}
			});
		}
	}
}
/*******************************  邮箱绑定设置结束   ********************************/

$("#bind_email").keyup(function() {
	var bind_email = $("#bind_email").val();

	if(bind_email != "") {
		$("#bind_mail_btn").addClass("active");
	} else {
		return false;
	}
}).blur(function() {
	var bind_email = $("#bind_email").val();
	if(bind_email != "") {
		$("#bind_mail_btn").addClass("active");
	} else {
		$("#bind_mail_btn").removeClass("active");
		return false;
	}
});
$("#mobileMessage").keyup(function() {
	var bind_email = $("#mobileMessage").val();

	if(bind_email != "") {
		$("#nextStep").addClass("active");
	} else {
		$("#nextStep").removeClass("active");
		return false;
	}
}).blur(function() {
	var bind_email = $("#mobileMessage").val();

	if(bind_email != "") {
		$("#nextStep").addClass("active");
	} else {
		$("#nextStep").removeClass("active");
		return false;
	}
});
$("#newEmail").keyup(function() {
	var bind_email = $("#newEmail").val();

	if(bind_email != "") {
		$("#bind_email_end").addClass("active");
	} else {
		$("#bind_email_end").removeClass("active");
		return false;
	}
}).blur(function() {
	var bind_email = $("#newEmail").val();
	if(bind_email != "") {
		$("#bind_email_end").addClass("active");
	} else {
		$("#bind_email_end").removeClass("active");
		return false;
	}
});

function getMsg(str) {

	$(".mask_tip").show().html(str);
	setTimeout(function() {
		$(".mask_tip").hide();
	}, 2000);
}