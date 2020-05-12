var reg = /^1[123456789]\d{9}$/;
var currentMobile;
var isMobile = false;
var mobile;
var reg = /^1[123456789]\d{9}$/;
var regp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
var isCode = false;
var isPwd = false;
var click = false;
var click2 = false;
$(function() {

	//获取用户信息
	getUserInfo();

	//获取图片验证码
	getPictureCode();

});

function getUserInfo() {
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
				window.location.href = "index.html";
			}
			if(result.state == '0') {
				var name = result.data.name;
				$('#username').val(name);
				mobile = name;
				name = name.replace(name.substr(3, 4), "****");
				$('#myphone').val(name); // 主页显示处理后的手机号

			}
		}
	});
}
/**---------------------**/
function nextStep() {

	var code = $("#code").val();
	var key = $("#codeKey").val();
	var phoneCode = $("#oldCode").val();

	if(code != "" && phoneCode != "") {
		$(".lastInput").addClass("active");
	} else {
		$(".lastInput").removeClass("active");
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

				getMsg("该手机号未注册");
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
												getPictureCodeTwo();
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
				$("#pictureCodeR").html(result.pictureCode);
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

	var code = $("#code").val();
	var key = $("#codeKey").val();
	var phoneCode = mobile;
	//手机号码验证

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
					getMsg("该手机号尚未注册");
					click = false;
					return false;
				} else {
					currentMobile = mobile;

					if(code == null || code == "") {
						getMsg("图形验证码不能为空");
						click = false;
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
												click = false;
												return false;

											}
											click = true;
										}
									});

								} else {
									getMsg("请输入正确的图形验证码");
									click = false;
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
var InterValObj2; //timer变量，控制时间
var count2 = 60; //间隔函数，1秒执行
var curCount2; //当前剩余秒数
function intervalTwo() {

	curCount2 = count2;
	// 设置button效果，开始计时
	$("#getCodeTwo").attr("disabled", "true");
	$("#getCodeTwo").addClass("default").html("倒计时" + curCount2 + "S");
	InterValObj2 = window.setInterval(SetRemainTimeTwo, 1000); //启动计时器，1秒执行一次
}

function SetRemainTimeTwo() {
	if(curCount2 == 0) {
		window.clearInterval(InterValObj); //停止计时器
		$("#getCodeTwo").removeAttr("disabled"); //启用按钮
		$("#getCodeTwo").html("重新获取").removeClass("default");
		click2 = false;
	} else {
		curCount2--;
		$("#getCodeTwo").html("倒计时" + curCount2 + "S");
	}
}

function getPictureCodeTwo() {

	$.ajax({
		url: ctxpath + "/sm/getPictureCode",
		type: "post",
		dataType: "json",
		data: {
			from: '2'
		},
		success: function(result) {
			if(result.state == "0") {
				$("#pictureCodeRTwo").html(result.pictureCode);
				$("#codeKeyTwo").val(result.key);
			}
		}
	});
}

function sendMessageTwo() {

	var code = $("#codeTwo").val();
	var key = $("#codeKeyTwo").val();
	var phoneCode = $("#newMobile").val();
	//手机号码验证

	if(click2) {
		return false;

	} else {
		if(phoneCode == ""||phoneCode == null) {
			getMsg("手机号不能为空");
			click2 = false;
			return false;
		} else if(!reg.test(mobile)) {
			getMsg("请输入正确的手机号");
			click2 = false;
			return false;
		} else {

			$.ajax({
					url: ctxpath + "/verify/checkMobilePhoneIsRegistered",
					type: "post",
					dataType: "json",
					data: {
						mobilePhone: phoneCode,
						from: '1'
					},
					success: function(result) {
						if(result.state == "5") {

							if(code == null || code == "") {
								getMsg("图形验证码不能为空");
								click2 = false;
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
													mobilePhone: phoneCode,
													type: '1',
													from: '1',
													key: key,
													picturCode: code
												},
												success: function(result) {

													if(result.state == "0") {
														intervalTwo();

													} else {
														getMsg(result.message);
														click2 = false;
														return false;

													}
													click2 = true;
												}
											});

										} else {
											getMsg("请输入正确的图形验证码");
											click2 = false;
											return false;
										}
									}
								});
							}
						} else {
							getMsg("该手机号已注册");
							click2 = false;
							return false;

						}
					
				}
			});
		click2 = true;
		}
	}
}

function getMsg(str) {

	$(".mask_tip").show().html(str);
	setTimeout(function() {
		$(".mask_tip").hide();
	}, 2000);
}
/**---------------------**/
function bindPhone() {

	var code = $("#codeTwo").val();
	var key = $("#codeKeyTwo").val();
	var phoneCode = $("#newMobile").val();
	var oldCodeTwo = $("#oldCodeTwo").val();
	if(code != "" && phoneCode != "" && oldCodeTwo != "") {
		$(".lastSure").addClass("active");
	} else {
		$(".lastSure").removeClass("active");
		return false;
	}
	$.ajax({
		url: ctxpath + "/verify/checkMobilePhoneIsRegistered",
		type: "post",
		dataType: "json",
		data: {
			mobilePhone: phoneCode,
			from: '1'
		},
		success: function(result) {
			if(result.state == '5') { //已注册
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
											mobilePhone: phoneCode,
											smsCode: oldCodeTwo,
											from: '1'
										},
										success: function(result) {
											if(result.state == "0") {
												updateUserPhone(phoneCode);
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
			} else if(result.state == "0") {
				getMsg("该手机号已注册");
				return false;

			} else {
				getMsg(result.message);
			}
		}
	});
}

function updateUserPhone(mobile) {
	if(token != null && token.trim().length > 0) {
		var newphone = mobile;
		$.ajax({
			url: ctxpath + "/user/updateUserPhone",
			type: "post",
			dataType: "json",
			data: {
				from: '2',
				token: token,
				newphone: newphone
			},
			success: function(result) {
				if(result.state == "0") {
					$(".phone_step_two").remove();
					$(".setting_success").show();
					var second = 3;
					window.setInterval(function() {
						$("#second").html(second--);
					}, 1000); //启动计时器，1秒执行一次

					window.setTimeout(function() {
						logout()

					}, 3000)
				} else {
					$(".error_msg").html("失败，请重试！");
					$(".error_msg").show();
				}
			}
		});
	} else {
		logout();
	}
}

$("#code,#oldCode").keyup(function() {
	var code = $("#code").val();
	var oldCode = $("#oldCode").val();

	if(code != "" && oldCode != "") {
		$(".lastInput").addClass("active");
	} else {
		$(".lastInput").removeClass("active");
		return false;
	}
}).blur(function() {
	var code = $("#code").val();
	var oldCode = $("#oldCode").val();
	if(code != "" && oldCode != "") {
		$(".lastInput").addClass("active");
	} else {
		$(".lastInput").removeClass("active");
		return false;
	}
});
$("#codeTwo,#oldCodeTwo,#newMobile").keyup(function() {
	var codeTwo = $("#codeTwo").val();
	var oldCodeTwo = $("#oldCodeTwo").val();
	var newMobile = $("#newMobile").val();
	if(codeTwo != "" && oldCodeTwo != "" && newMobile != "") {
		$(".lastSure").addClass("active");
	} else {
		$(".lastSure").removeClass("active");
		return false;
	}
}).blur(function() {
	var codeTwo = $("#codeTwo").val();
	var oldCodeTwo = $("#oldCodeTwo").val();
	var newMobile = $("#newMobile").val();
	if(codeTwo != "" && oldCodeTwo != "" && newMobile != "") {
		$(".lastSure").addClass("active");
	} else {
		$(".lastSure").removeClass("active");
		return false;
	}
});