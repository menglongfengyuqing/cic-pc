jQuery.support.cors = true;
$(function() {
	//	var token = $.cookie('token');
	$.ajax({
		url: ctxpath + "/user/getUserInfo",
		type: 'post',
		dataType: 'json',
		data: {
			from: '1',
			token: token
		},
		success: function(result) {

			if(result.state == '0') {
				bindCard = result.data.cgbBindBankCard;
				if(bindCard == 2) {
					//获取用户绑卡信息
					$.ajax({
						url: ctxpath + "/user/getcgbUserBankCard",
						type: 'post',
						dataType: 'json',
						async: false,
						data: {
							from: '1',
							token: token,
						},
						success: function(json) {
							if(json.state == 4) {
								logout();
							} else if(json.state == 5) {
								window.location.href = "account_setting_bankcard.html";
							} else if(json.state == 0) {
								var data = json.data;
								$("#bindBankCardNo").val(data.bindBankCardNo);
								$("#amount").siblings(".freeCash").html("每月免费提现次数2次，本月剩余" + data.freeCash + "次");
								$("#realName").val(data.realName);
							} else {}
						}
					});

					//用户账户信息
					$.ajax({
						url: ctxpath + "/user/getcgbUserAccount ",
						type: 'post',
						dataType: 'json',
						async: false,
						data: {
							from: '1',
							token: token,
						},
						success: function(json) {
							if(json.state == 4) {
								logout();
							} else if(json.state == 0) {
								var data = json.data;
								availableAmount = formatCurrency(data.availableAmount);
								$("#availableAmount").val(availableAmount);
								while(availableAmount.indexOf(",") > 0) {
									availableAmount = availableAmount.replace(",", "");
								}
							} else {}
						},
						error: function(e) {}
					});
				} else {
					history.go(-1);
				}
			} else {
				//				alert("getUserInfo:"+result);
				logout();
			}
		}
	});

	//-----------------------------点击提现按钮---------------------------------------------------
	$("#withdraw_btn").click(function() {
		withdrawLanMao();
	});

});

//CGB支付
function withdrawCGB() {
	var amount = $("#amount").val();
	amount = amount.trim();
	if(checkAmount(amount)) {
		$.ajax({
			url: ctxpath + "/newwithdraw/withdrawWeb",
			type: 'post',
			dataType: 'json',
			data: {
				from: '2',
				token: token,
				amount: amount,
				bizType: '01'
			},
			success: function(json) {
				if(json.state == 4) {
					logout();
				} else if(json.state == 0) {
					var data = json.data;
					var tm = data.tm;
					var merchantId = data.merchantId;

					var url = cgbpath;  // 由于修改了common.js里的网关配置，所以这个功能不可用

					window.location.href = url + "?data=" + data.data + "&tm=" + tm + "&merchantId=" + merchantId;
				} else if(json.state == 5) {
					$(".error_msg").html("您输入的提现金额有误，请您核实后重新输入。");
					$(".error_msg").show();
				} else if(json.state == 7) {
					window.location.href = "account_setting_bankcard.html";
				}
			}
		});
	}
}

//懒猫支付 2.0 提现
function withdrawLanMao() {
	var amount = $("#amount").val();
	amount = amount.trim();
	if(checkAmount(amount)) {
		$.ajax({
			url: ctxpath + "/lanmaowithdraw/withdrawWeb",
			type: 'post',
			dataType: 'json',
			data: {
				from: '2',
				token: token,
				amount: amount,
				bizType: '01'
				// branchBank: '', // 分支银行名称
				// cityCode: '' // 分支很行城市编号
			},
			success: function(json) {
				if(json.state == 4) {
					logout();
				} else if(json.state == 0) {
					$(".mask_msg_pay").show();
					$(".mask_drop").show();
					var _reqData = json.data.reqData;// 参数对象
					console.log("_reqData=" +_reqData);
					console.log(JSON.stringify(json));
					openPostWindow(json.data); // 发起网关请求
				} else if(json.state == 5) {
					$(".error_msg").html("您输入的提现金额有误，请您核实后重新输入。");
					$(".error_msg").show();
				} else if(json.state == 7) {
					window.location.href = "account_setting_bankcard.html";
				}
			}
		});
	}
}

function withdrawSuccess() {
	window.location.href = "account_home.html";
}

function checkAmount(amount) {
	var reg = /^\d+(\.\d{1,2})?$/;
	if(!reg.test(amount)) {
		$(".error_msg").html("您输入的金额有误，请您核实后重新输入。");
		$(".error_msg").show();
		return false;
	};

	//	var availableAmount = $("#availableAmount").val();
	if(parseFloat(availableAmount) < parseFloat(amount)) {
		$(".error_msg").html("提现金额不可大于可用余额");
		$(".error_msg").show();
		return false;
	}
	return true;
}
function checkBlus() {
	var rechargeMoney = $("#amount").val().trim();
	var obj = document.getElementById("amount");
	obj.value = obj.value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符   
	obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的   
	obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数   
	if(obj.value.indexOf(".") < 0 && obj.value != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
		obj.value = parseFloat(obj.value);
	}
	
}