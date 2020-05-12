jQuery.support.cors = true;
$(function() {
	//获取银行卡信息
	getUserBankCardInfo();
	$(".error_msg").html("");
});
$("#realName,#IdCard,#bankCard,#bankCardPhone").keyup(function() {
	var realName = $("#realName").val();
	var idCard = $("#IdCard").val();
	var bankCard = $("#bankCard").val();
	var bankCardPhone = $("#bankCardPhone").val();
	if(realName != "" && idCard != "" && bankCard != "" && bankCardPhone != "") {
		$("#bind_card_btn").addClass("active");
	} else {
		return false;
	}
}).blur(function() {
	var realName = $("#realName").val();
	var idCard = $("#IdCard").val();
	var bankCard = $("#bankCard").val();
	var bankCardPhone = $("#bankCardPhone").val();
	if(realName != "" && idCard != "" && bankCard != "" && bankCardPhone != "") {
		$("#bind_card_btn").addClass("active");
	} else {
		return false;
	}
});

// 用window.open()方法跳转至新页面并且用post方式传参--个人绑卡注册
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


//CGB
$(".bank_submit").click(function() {

	var realName = $("#realName").val();
	var idCard = $("#IdCard").val();
	var bankCard = $("#bankCard").val();
	var bankCardPhone = $("#bankCardPhone").val();
	var certificateChecked = $("#certificateChecked").val();
	if(realName == "") {
		$(".error_msg").show().html("姓名不能为空");
		return false;
	}
	if(idCard == "") {
		$(".error_msg").show().html("身份证号不能为空");
		return false;
	}
	if(bankCard == "") {
		$(".error_msg").show().html("银行卡号不能为空");
		return false;
	}
	if(bankCardPhone == "") {
		$(".error_msg").show().html("银行预留手机号不能为空");
		return false;
	}
	if(realName != "" && idCard != "" && bankCard != "" && bankCardPhone != "") {
		if(checkedName() && checkedIdCard() && checkbankCardPhone()) {
			if(certificateChecked != '2'){//表示未开户未注册  2：已实名认证--已开户 ，1：未实名认证--未开户
				$.ajax({
	//				url: ctxpath + "/cgbPay/accountCreateWeb",
					url: ctxpath + "/lanmaoAccount/personalRegisterExpand",
					type: "post",
					async: false,
					dataType: "json",
					data: {
						from: '2',
						token: token,
						bankCardNo: bankCard,
						bankCardPhone: bankCardPhone,
						certNo: idCard,
						realName: realName,
						bizType: '01'
					},
					success: function(json) {
						console.log(json);
						if(json.state == 4) {
							logout();
						} else if(json.state == 0) {
							var result = json.data;
	//						var data = obj.data;
	//						var tm = obj.tm;
	//						var merchantId = obj.merchantId;
	//						var url = cgbpath + "?data=" + data + "&tm=" + tm + "&merchantId=" + merchantId;
							// window.open(cgbpath + "?result=" + result, "PERSONAL_REGISTER_EXPAND",false);
							openPostWindow(cgbpath, result);
							
							window.location.href = 'index.html';
							
						} else {
							//银行卡校验错误，进行处理
	
							$(".bank_error").hide();
							$("#bankCard").siblings(".bank_error").show().html("您输入的银行卡号有误，请您核实后重新输入。");
	
						}
					},
					error: function(e) {
						//系统出现异常
						$(".bank_error").hide();
						$("#bankCard").siblings(".bank_error").show().html("网络出现异常，请您稍后再试。");
	
						return false;
					}
				});
			}else{
				//表示未开户已注册--调用个人绑卡
				$.ajax({
	//				url: ctxpath + "/cgbPay/accountCreateWeb",
					url: ctxpath + "/lanmaoAccount/changeBankCard",
					type: "post",
					async: false,
					dataType: "json",
					data: {
						from: '2',
						token: token,
						bankCardNo: bankCard,
						bankCardPhone: bankCardPhone,
						certNo: idCard,
						realName: realName,
						bizType: '01'
					},
					success: function(json) {
						console.log(json);
						if(json.state == 4) {
							logout();
						} else if(json.state == 0) {
							var result = json.data;
	//						var data = obj.data;
	//						var tm = obj.tm;
	//						var merchantId = obj.merchantId;
	//						var url = cgbpath + "?data=" + data + "&tm=" + tm + "&merchantId=" + merchantId;
							// window.open(cgbpath + "?result=" + result, "PERSONAL_REGISTER_EXPAND",false);
							openPostWindow(cgbpath, result);
							window.location.href = 'index.html';
						} else {
							//银行卡校验错误，进行处理
	
							$(".bank_error").hide();
							$("#bankCard").siblings(".bank_error").show().html("您输入的银行卡号有误，请您核实后重新输入。");
	
						}
					},
					error: function(e) {
						//系统出现异常
						$(".bank_error").hide();
						$("#bankCard").siblings(".bank_error").show().html("网络出现异常，请您稍后再试。");
	
						return false;
					}
				});
			}
		}

	} else {
		return false;
	}
	
	//验证手机号
	function checkbankCardPhone() {
		var rt = false;
		var bankCardPhone = $("#bankCardPhone").val();
		var re = /^1\d{10}$/;
		if(re.test(bankCardPhone)) {
			rt = true;
		} else {
			$(".bank_error").hide();

			$("#bankCardPhone").siblings(".bank_error").show().html("您输入的手机号有误，请您核实后重新输入。");

			rt = false;
		}
		return rt;
	}

	//验证身份证
	function checkedIdCard() {
		var rt = false;
		var uIdCard = $("#IdCard")
		var uIdCardVal = $("#IdCard").val();
		var b = uIdCardVal.substring(17);
		if(uIdCardVal.length == 18) {
			if(isNaN(uIdCardVal.substring(0, 17))) {
				$(".bank_error").hide();
				$("#IdCard").siblings(".bank_error").show().html("您输入的身份证号有误，请您核实后重新输入。");
				rt = false;
			} else
			if((b == 'X') || !isNaN(b)) {
				$(".bank_error").hide();
				rt = true;
			} else {
				$(".bank_error").hide();
				$("#IdCard").siblings(".bank_error").show().html("您输入的身份证号有误，请您核实后重新输入。");

				rt = false;
			}

		} else {
			$(".bank_error").hide();
			$("#IdCard").siblings(".bank_error").show().html("您输入的身份证号有误，请您核实后重新输入。");

			rt = false;
		}
		return rt;
	}

	//验证真实姓名
	function checkedName() {
		var rt = false;
		var uName = $("#realName");
		if(uName.val().length > 1 && uName.val().length < 21) {
			$(".error_msg").hide();
			rt = true;
		} else {
			$("#realName").siblings(".bank_error").show().html("您输入的姓名长度有误，请重新输入");
			rt = false;
		}
		return rt;
	}
});

//修改银行卡信息
function modifyBankCard() {
	$(".error_msg ").hide();
	$.ajax({
		url: ctxpath + "/cgbPay/changeBankCardWeb",
		type: "post",
		dataType: "json",
		data: {
			from: '1',
			token: token
		},
		success: function(result) {
			if(result.state == 4) {
				logout();
			} else if(result.state == 0) {
				var obj = result.data;
				var data = obj.data;
				var tm = obj.tm;
				var merchantId = obj.merchantId;
				var url = cgbpath + "?data=" + data + "&tm=" + tm + "&merchantId=" + merchantId;
				window.location.href = url;
			}
			if(result.state == 3) {

				$(".bank_error").hide();
				$("#IdCard").siblings(".bank_error").show().html(result.message);

			}
		}
	});
}

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
								var data = json.data;
								if(data.certificateChecked==2){
								$('#realName').attr("disabled", "disabled");
								$('#IdCard').attr("disabled", "disabled");
								$("#realName").val(data.realName);
								$("#IdCard").val(data.IdCardNo);
								}
								$("#certificateChecked").val(data.certificateChecked);
								//				window.location.href = "account_setting.html";
							} else if(json.state == 0) {
								var data = json.data;
								$('#realName').attr("disabled", "disabled");
								$('#IdCard').attr("disabled", "disabled");
								$('#bankCard').attr("disabled", "disabled");
								$("#realName").val(data.realName);
								$("#IdCard").val(data.IdCard);
								$("#bankCard").val(data.bindBankCardNo);
								$("#bankCardPhone").val(data.bankCardPhone);
								$("#bankCardPhone").attr("disabled", "disabled");
								$("#bind_card_btn").hide();
								$("#certificateChecked").val(data.certificateChecked);
							} else {

								$(".bank_error").hide();
								$("#IdCard").siblings(".bank_error").show().html(json.message);

							}
						}
					});
			} else {
				logout();
			}
		}
	});

}
/*查看支持的银行*/
$(".check_bank").click(function() {
	$(".bank_list,.mask_drop").show();
});
$(".close_bank_mask").click(function() {
	$(".bank_list,.mask_drop").hide();
});