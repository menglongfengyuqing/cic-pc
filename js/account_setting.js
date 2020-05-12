var userBindBankCard;
$(function() {
	//获取用户信息
	getUserInfo();

});

//获取用户信息
function getUserInfo() {
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
				var user = result.data;
				var userRealName = user.realName;
				var uesrId = user.IdCard;
				var phone = user.name;
				var phoneNum = phone.substr(0, 3) + '****' + phone.substr(7); //手机号
				var userIdCard = (user.IdCard != null && user.IdCard.trim().length > 0);
				var userBindEmail = (user.bindEmail == 2);
				userBindBankCard = (user.cgbBindBankCard == 2);
				var certificateChecked = (user.certificateChecked == 2);
				//判断绑定银行卡状态
				if(certificateChecked){
					$("#realNameStatic").html("已认证"); //实名认证
					$("#bankStatic").html("已开通"); //
					$("#realNameMsg").html(userRealName+"&nbsp;&nbsp;&nbsp;&nbsp;" + uesrId);
				} else {
					$("#bankStatic").html('<a href="account_setting_bankcard.html">未开通</a>');
					$("#realNameMsg").html("完成实名认证才能出借");
					$("#realNameStatic").html("未认证");
				}
				if(userBindBankCard) {
//					$("#bankStatic").html("已开通"); //
//					$("#realNameStatic").html("未认证");
					$("#bindBankCardState").html('<a href="javascript:;"  onclick="untyingCard()">解绑</a>'); //银行卡状态 解绑
//					$("#realNameStatic").html("已认证"); //实名认证
//					$("#realNameMsg").html(userRealName+"&nbsp;&nbsp;&nbsp;&nbsp;" + uesrId);

					$("#bindBankCardMsg").html(user.bindBankCardNo);
					$("#modifyMobileExpandMsg").html("在这可以修改银行卡预留手机号哦");
					$("#modifyMobileExpand").html('<a href="javascript:;" onclick="modifyMobileExpand()">修改</a>'); //银行卡状态 解绑
					
					$("#activateStockedUser").html('<a href="javascript:;" onclick="activateStockedUser()">会员开通</a>'); //会员开通
				} else {
					$("#bindBankCardState").html('<a href="account_setting_bankcard.html">未绑定</a>');

//					$("#bankStatic").html('<a href="account_setting_bankcard.html">未开通</a>');
//					$("#realNameStatic").html("未认证");
//					$("#realNameMsg").html("完成实名认证才能出借");
					$("#bindBankCardMsg").html("提现时资金转入的银行卡账户");
					
					$("#activateStockedUser").html('<a href="javascript:;" onclick="activateStockedUser()">会员开通</a>'); //会员开通
				}

				var email = result.data.email;
				if(result.data.bindEmail == "2") { // 已激活
					
					$("#bindEmailMsg").html(email);
					$("#mail_btn").attr("href", "account_setting_mail.html?state=2").html("修改");
					$("#bindEmail").show();
				} else if(result.data.bindEmail == "1") { // 未绑定（没有邮箱）
					$("#mail_btn").attr("href", "account_setting_mail.html?state=1").html('立即绑定');;

				} 

				$("#lastLoginDate").html("上次登录时间:" + user.lastLoginDate);

				if(user.isTest == 0) { //未评测
					$("#question").html('<a href="account_risk_test.html">立即评估</a>');
					$("#score").html("了解风险承受能力，减少出借损耗");
				}
				if(user.isTest == 1) { //已评测
					$("#question").html('<a href="account_risk_test.html">重新测评</a>');
					$("#score").html(user.userType);
				}
				$("#phoneNum").html(phoneNum);
			} else {
				$.cookie("token", "");
				window.location.href = 'login.html';
			}
		}
	});
}

$(".close_mask_btn").click(function() {
	$(".activate_mailbox ,.mask_drop,.mask_fixed_wrap").hide();
});
//修改银行卡信息
function modifyBankCard(){
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
				var url = cgbpath+"?data=" + data + "&tm=" + tm + "&merchantId=" + merchantId;
				window.location.href = url;
			} if(result.state == 3){
				console.log(result.message);
				
			}
		}
	});
}

//解绑银行卡
function untyingCard(){
	$.ajax({
		url: ctxpath + "/lanmaoAccount/untyingCard",
		type: "post",
		dataType: "json",
		data: {
			from: '1',//1:表示为出借人解绑 2：表示为借款人解绑
			token: token
		},
		success: function(result) {
			if(result.state == 4) {
				logout();
			} else if(result.state == 0) {
//				var obj = result.data;
//				var data = obj.data;
//				var tm = obj.tm;
//				var merchantId = obj.merchantId;
//				var url = cgbpath+"?data=" + data + "&tm=" + tm + "&merchantId=" + merchantId;
//				window.location.href = url;
				var obj =  result.data;
				openPostWindow(cgbpath, obj);
				//执行完跳转到首页
				window.location.href = 'index.html';
			} if(result.state == 3){
				console.log(result.message);
				
			}
		}
	});
}

//预留手机号更新
function modifyMobileExpand(){
	$.ajax({
		url: ctxpath + "/lanmaoAccount/modifyMobileExpand",
		type: "post",
		dataType: "json",
		data: {
			from: '1',//1:表示为出借人解绑 2：表示为借款人解绑
			token: token
		},
		success: function(result) {
			if(result.state == 4) {
				logout();
			} else if(result.state == 0) {
//				var obj = result.data;
//				var data = obj.data;
//				var tm = obj.tm;
//				var merchantId = obj.merchantId;
//				var url = cgbpath+"?data=" + data + "&tm=" + tm + "&merchantId=" + merchantId;
//				window.location.href = url;
				var obj =  result.data;
				openPostWindow(cgbpath, obj);
				//执行完跳转到首页
				window.location.href = 'account_home.html';
			} if(result.state == 3){
				console.log(result.message);
				
			}
		}
	});
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

//开通会员
function activateStockedUser1111(){
	$.ajax({
		url: ctxpath + "/lanmaoAccount/memberActivation",
		type: "post",
		dataType: "json",
		data: {
			from: '1',//1:表示为出借人解绑 2：表示为借款人解绑
			token: token
		},
		success: function(result) {
			if(result.state == 4) {
				logout();
			} else if(result.state == 0) {

				var obj =  result.data;
				openPostWindow(cgbpath, obj);
				//执行完跳转到首页
				window.location.href = 'account_home.html';
			} if(result.state == 3){
				console.log(result.message);
				
			}
		}
	});
}
