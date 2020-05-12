var isOldMobile = false;
var isNewMobile = false;
var regp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
$("#oldPwd,#newPwd,#sureNewPwd").keyup(function() {
	var oldPwd = $("#oldPwd").val();
	var newPwd = $("#newPwd").val();
	var sureNewPwd = $("#sureNewPwd").val();

	if(oldPwd != "" && newPwd != "" && sureNewPwd != "") {
		$(".submit_mail input").addClass("active");
	} else {
		$(".submit_mail input").removeClass("active");
		return false;
	}
}).blur(function() {
	var oldPwd = $("#oldPwd").val();
	var newPwd = $("#newPwd").val();
	var sureNewPwd = $("#sureNewPwd").val();
	if(oldPwd != "" && newPwd != "" && sureNewPwd != "") {
		$(".submit_mail input").addClass("active");
	} else {
		$(".submit_mail input").removeClass("active");
		return false;
	}
});

$("#sureBtn").click(function() {
	var oldPwd = $("#oldPwd").val();
	var newPwd = $("#newPwd").val();
	var sureNewPwd = $("#sureNewPwd").val();
	if(oldPwd != "" && newPwd != "" && sureNewPwd != "") {
		checkOldPwd();
        $(".submit_mail input").addClass("active");
	} else {
		$(".submit_mail input").removeClass("active");
		return false;
	}
});

/**
 * 校验旧密码是否输入正确
 */
function checkOldPwd() {
	var pwd = $("#oldPwd").val();
	if(token != null && $.trim(token) != "") {
		pwd = str_md5(pwd);
		pwd = $.base64.encode(pwd);
		$.ajax({
			url: ctxpath + "/user/newCheckOldPwd",
			type: 'post',
			dataType: 'json',
			data: {
				from: '2',
				token: token,
				pwd: pwd
			},
			success: function(json) {
				console.log(json);
				if(json.state == "0") {
					$(".error_msg").hide();
					$("#oldPwd").attr("readonly", "readonly");
					checkNewPwd();

				} else {
					$("#oldPwd").siblings(".error_msg").html("原密码错误").show();
					return false;
				}
			}
		});
	} else {
		logout();
	}

}

/**
 * 校验新密码
 */
function checkNewPwd() {

	var newpwd = $("#newPwd").val();
	var pwdRepeat = $("#sureNewPwd").val();
	if(newpwd == "" || newpwd == null) {
		$("#newPwd").siblings(".error_msg").html("密码不能为空").show();
		return false;
	} else if(!regp.test(newpwd)) {
		$("#newPwd").siblings(".error_msg").html("密码格式为6-16位数字加字母").show();
		return false;
	} else if(pwdRepeat != newpwd) {
		$("#sureNewPwd").siblings(".error_msg").html("两次输入的密码必须一致").show();
		return false;
	} else {
		newpwd = str_md5(newpwd);
		newpwd = $.base64.encode(newpwd);
		$.ajax({
			url: ctxpath + "/user/newUpdateUserPwd",
			type: "post",
			dataType: "json",
			data: {
				from: '2',
				token: token,
				pwd: newpwd
			},
			success: function(result) {
				if(result.state == "0") {
					$(".setting_mail_con").hide();
					$(".setting_success").show();
						var counts = 3;
					setInterval(function() {
						counts--;
						$("#second").html(counts);
						if(counts == 0) {
							logout();
						}
					}, 1000);

				}
				else if(result.state == "4"){
					logout();
				}
				else{
					$("#sureNewPwd").siblings("#error_msg").html(result.message).show();
				}
			}
		});
	}
}