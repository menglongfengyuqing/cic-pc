
jQuery.support.cors = true;
var bankcode;

$(function() {
	//清空错误提示
	$(".error_msg").hide();
	getUserBankCardInfo(); //获取用户绑卡信息
	//	getUserAccount()
	$("#pay_auth_btn").click(function() {
		authPay();
	});
	// 快捷支付绑定事件
	$("#fast_pay_auth_btn").click(function() {
		fastPay();
	});

});
// 转账充值 2.0功能不支持
$(".recharge_tit h4").eq(0).click(function() {
	$(".recharge_big").show();
	$(".bank_way_quick").hide();
	$(".fast_way_quick").hide();
	$(this).addClass("cur").siblings().removeClass("cur");
	$(".recharge_msg_wrap .recharge_way_msg").eq(0).addClass("cur").siblings().removeClass("cur");
});
// 网银充值  
$(".recharge_tit h4").eq(1).click(function() {
	$(".recharge_big").hide();
	$(".fast_way_quick").hide();
	$(".bank_way_quick").show();
	$(this).addClass("cur").siblings().removeClass("cur");
	$(".recharge_msg_con .recharge_way_msg").eq(1).addClass("cur").siblings().removeClass("cur");
});
// 快捷支付 2.0新增
$(".recharge_tit h4").eq(2).click(function() {
	$(".recharge_big").hide();
	$(".bank_way_quick").hide();
	$(".fast_way_quick").show();
	$(this).addClass("cur").siblings().removeClass("cur");
	$(".recharge_msg_con .recharge_way_msg").eq(2).addClass("cur").siblings().removeClass("cur");
});
// 转账充值， 下一步
$("#pay_big_step").click(function() {
	var amount = $("#authAmountBig").val();
	amount = amount.trim();
	if(amount == "" || amount == null) {
		$(".error_msg").html("请输入充值金额");
		$(".error_msg").show();
		return false;
	} else if(checkAmount(amount)) {
		$.ajax({
			url: ctxpath + "/newpay/largeRechargeWeb",
			type: "post",
			async: false,
			dataType: 'json',
			data: {
				from: "2",
				token: token,
				amount: amount,
				bizType: '01'
			},
			success: function(json) {
				if(json.state == 4) {
					logout();
				} else {
					if(json.state == 0) {
						$(".mask_msg_pay").show();
						$(".mask_drop").show();
						var data = json.data;
						var tm = data.tm;
						var merchantId = data.merchantId;
						var url = "http://sandbox.firstpay.com/hk-fsgw/gateway?data=" + data.data + "&tm=" + tm + "&merchantId=" + merchantId;
						window.open(url);
					} else {
						$(".error_msg").show().html(json.message);

					}
				}
			},
			error: function(e) {
				$(".mask_investNo_tip").show().html("网络出现异常，请您稍后再试。");
			}
		});
	}
});
//获取用户绑卡信息
function getUserBankCardInfo() {
	$.ajax({
		url: ctxpath + "/user/getUserInfoNew",
		type: 'post',
		dataType: 'json',
		data: {
			from: '1',
			token: token
		},
		success: function(result) {

			if(result.state == '0') {
				bindCard = result.data.cgbBindBankCard;
				$("#bankNoImage").attr("src", result.data.bankNoImage);
				if(bindCard == 2) {
					$.ajax({
						url: ctxpath + "/user/getcgbUserBankCard",
						type: 'post',
						dataType: 'json',
						async: false,
						data: {
							from: '1',
							token: token
						},
						success: function(json) {
							if(json.state == 4) {
								logout();
							} else if(json.state == 5) {
								window.location.href = "account_setting_bankcard.html";
							} else if(json.state == 0) {
								var data = json.data;
								$("#bindBankCardNo,#bindBankCardNoBig").html(data.bindBankCardNo);
								$("#userAccount").html(formatCurrency(data.availableAmount));
								$("#realName").html(data.realName);

							} else {
								$(".error_msg").html(json.message);
								$(".error_msg").show();
							}
						}
					});
				} else {
					history.go(-1);
				}
			} else {
				logout();
			}
		}
	});

}

//认证支付 1.0
function authPay1_0() {

	var amount = $("#authAmount").val();
	amount = amount.trim();
	if(amount == "" || amount == null) {
		$(".error_msg").html("请输入充值金额");
		$(".error_msg").show();
		return false;
	} else if(checkAmount(amount)) {
		$.ajax({
			url: ctxpath + "/newpay/authRechargeWeb",
			type: "post",
			async: false,
			dataType: 'json',
			data: {
				from: "2",
				token: token,  
				amount: amount,
				bizType: '01'
			},
			success: function(json) {
				if(json.state == 4) {
					$.cookie('token', null);
					logout();
				} else {
					if(json.state == 0) {
						$(".mask_msg_pay").show();
						$(".mask_drop").show();
						var data = json.data;
						var tm = data.tm;
						var merchantId = data.merchantId;
						var url = cgbpath + "?data=" + data.data + "&tm=" + tm + "&merchantId=" + merchantId;
						window.open(url);
					} else {
						$(".error_msg").html(json.message);
						$(".error_msg").show();
					}
				}
			},
			error: function(e) {
				$(".error_msg").show().html("网络出现异常，请您稍后再试。");
			}
		});
	}
}


//认证支付 2.0 网银支付
function authPay() {

	var amount = $("#authAmount").val();
	amount = amount.trim();
	if(amount == "" || amount == null) {
		$(".error_msg").html("请输入充值金额");
		$(".error_msg").show();
		return false;
	} else if(checkAmount(amount)) {
		$.ajax({
			url: ctxpath + "/lmpay/lanmaoWebRecharge",
			type: "post",
			async: false,
			dataType: 'json',
			data: {
				from: "1", // 1：pc；2: wap；3： android；4： ios；
				token: token, // redis里用户标识
				amount: amount, 
				isbankcode: "0"
			},
			success: function(json) {
				if(json.state == 4) {
					$.cookie('token', null);
					logout();
				} else {
					if(json.state == 0) {
						$(".mask_msg_pay").show();
						$(".mask_drop").show();
						// 添加懒猫2.0的充值逻辑
						var data = json.data.reqData;// 参数对象
						console.log("data=" +data)
						console.log(JSON.stringify(json))
						openPostWindow(json.data); // 发起网关请求
					} else {
						$(".error_msg").html(json.message);
						$(".error_msg").show();
					}
				}
			},
			error: function(e) {
				$(".error_msg").show().html("网络出现异常，请您稍后再试。");
			}
		});
	}
}

// 快捷支付
function fastPay() {
	var amount = $("#authAmountfast").val();
	amount = amount.trim();
	if(amount == "" || amount == null) {
		$(".error_msg").html("请输入充值金额");
		$(".error_msg").show();
		return false;
	} else if(checkAmount(amount)) {
		$.ajax({
			url: ctxpath + "/lmpay/lanmaoSwiftRecharge",
			type: "post",
			async: false,
			dataType: 'json',
			data: {
				from: "1", // 1：pc；2: wap；3： android；4： ios；
				token: token, // redis里用户标识
				amount: amount
			},
			success: function(json) {
				if(json.state == 4) {
					$.cookie('token', null);
					logout();
				} else {
					if(json.state == 0) {
						$(".mask_msg_pay").show();
						$(".mask_drop").show();
						// 添加懒猫2.0的充值逻辑
						var data = json.data.reqData;// 参数对象
						console.log("data=" +data)
						console.log(JSON.stringify(json))
						openPostWindow(json.data); // 发起网关请求
					} else {
						$(".error_msg").html(json.message);
						$(".error_msg").show();
					}
				}
			},
			error: function(e) {
				$(".error_msg").show().html("网络出现异常，请您稍后再试。");
			}
		});
	}
}

//金额校验
function checkAmount(amount) {
	var reg = /^\d+(\.\d{1,2})?$/;

	if(reg.test(amount)) {
		return true;
	};
	$(".error_msg").html("金额有误，请核实");
	$(".error_msg").show();
	return false;
}


// function checkBlus() {
// 	var rechargeMoney = $("#authAmountBig").val().trim();
// 	var obj = document.getElementById("authAmountBig");
// 	obj.value = obj.value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符   
// 	obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的   
// 	obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
// 	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数   
// 	if(obj.value.indexOf(".") < 0 && obj.value != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
// 		obj.value = parseFloat(obj.value);
// 	}
	
// }
function checkBlus2() {
	var rechargeMoney = $("#authAmount").val().trim();
	var obj = document.getElementById("authAmount");
	obj.value = obj.value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符   
	obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的   
	obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数   
	if(obj.value.indexOf(".") < 0 && obj.value != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
		obj.value = parseFloat(obj.value);
	}
	
}
function checkBlus3() {
	var rechargeMoney = $("#authAmountfast").val().trim();
	var obj = document.getElementById("authAmountfast");
	obj.value = obj.value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符   
	obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的   
	obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数   
	if(obj.value.indexOf(".") < 0 && obj.value != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
		obj.value = parseFloat(obj.value);
	}
	
}

