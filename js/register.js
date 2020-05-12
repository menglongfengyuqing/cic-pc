var recommendRefer = getArgumentsByName("id");
var recommendRefer2 = getArgumentsByName("refer"); //合作方
var reg = /^1[123456789]\d{9}$/;
var currentMobile;
var regp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
var userNo;
var currentMobile;
var click = false;
$(function () {
    //链接邀请好友

    if (recommendRefer != null && recommendRefer.trim().length > 0) {
        $("#recommendMobilePhone").attr("value", recommendRefer);
        $("#recommendMobilePhone").attr("readOnly", "true");
    }

    //获取图形验证码
    getPictureCode();
})

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
        success: function (result) {
            if (result.state == "0") {
                $("#pictureCodeR").html(result.pictureCode);
                $("#codeKey").val(result.key);
            }
        }
    });
}


//发送验证码
function sendMessage() {
    $(".error_msg").html("");
    var mobile = $("#moblieR").val();
    var code = $("#code").val();
    var key = $("#codeKey").val();
    var phoneCode = $("#phoneCode").val();
//手机号码验证
    if (mobile == null || mobile.trim() == "") {
        $(".error_msg").show().html("手机号不能为空");
        $(".step_one li").children(".register_liwrap").removeClass("default");
        $(".step_one li").eq(0).children(".register_liwrap").addClass("default");
        click = false;
        return false;
    }
    else if (!reg.test(mobile)) {
        $(".error_msg").show().html("请输入正确的手机号");
        $(".step_one li").children(".register_liwrap").removeClass("default");
        $(".step_one li").eq(0).children(".register_liwrap").addClass("default");
        click = false;
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
        success: function (result) {
            if (result.state == "0") {
                $(".error_msg").show().html("该手机号已注册");
                $(".step_one li").children(".register_liwrap").removeClass("default");
                $(".step_one li").eq(0).children(".register_liwrap").addClass("default");
                click = false;
                return false;
            } else {
                currentMobile = mobile;
                //验证图形验证码
                var code = $("#code").val();
                var key = $("#codeKey").val();
                if (code == null || code == "") {
                    $(".error_msg").show().html("图形验证码不能为空");
                    $(".step_one li").children(".register_liwrap").removeClass("default");
                    $(".step_one li").eq(1).children(".register_liwrap").eq(0).addClass("default");
                    click = false;
                    return false;
                }
                else {
                    $.ajax({
                        url: ctxpath + "/sm/checkPictureCode",
                        type: "post",
                        dataType: "json",
                        data: {
                            from: '1',
                            key: key,
                            pictureCode: code
                        },
                        success: function (result) {
                            if (result.state == "0") {
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
                                    success: function (result) {
                                        //console.log(result.data);
                                        if (result.state == "0") {
                                            interval();
                                            //埋点
                                            _czc.push(['_trackEvent', '注册创建账户', '点击', '获取验证码']);
                                              	click = true;
                                        } else {
                                            $(".error_msg").show().html(result.message);
                                            click = false;
                                            return false;

                                        }
                                    }
                                });
                            } else {
                                $(".error_msg").show().html("请输入正确的图形验证码");
                                $(".step_one li").children(".register_liwrap").removeClass("default");
                                $(".step_one li").eq(1).children(".register_liwrap").eq(0).addClass("default");
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
/*获取验证码倒计时*/
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount; //当前剩余秒数

function interval() {
    curCount = count;
    // 设置button效果，开始计时
    $("#btnSendCode").attr("disabled", "true");
    $("#btnSendCode").addClass("default").html("倒计时" + curCount + "S");
    InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
}

//timer处理函数
function SetRemainTime() {
    if (curCount == 0) {
        clearInterval(InterValObj); //停止计时器
        $("#btnSendCode").removeAttr("disabled"); //启用按钮
        $("#btnSendCode").removeClass("default").html("重新获取");
        click = false;
    } else {
        curCount--;
        $("#btnSendCode").addClass("default").html("倒计时" + curCount + "S");
    }
}
// 绑定键盘按下事件
$(document).keypress(function (e) {
    // 回车键事件
    if (e.which == 13) {
        login();
    }
});
//注册
function registOne() {
    $(".error_msg").html("");
    var mobile = $("#moblieR").val();
    var code = $("#code").val();
    var key = $("#codeKey").val();
    var phoneCode = $("#phoneCode").val();
    if (mobile == null || mobile.trim() == "") {
        $(".error_msg").show().html("手机号不能为空");
        $(".step_one li").children(".register_liwrap").removeClass("default");
        $(".step_one li").eq(0).children(".register_liwrap").addClass("default");
        return false;
    }
    else if (!reg.test(mobile)) {
        $(".error_msg").show().html("请输入正确的手机号");
        $(".step_one li").children(".register_liwrap").removeClass("default");
        $(".step_one li").eq(0).children(".register_liwrap").addClass("default");
        return false;
    }
    else {
        $.ajax({
            url: ctxpath + "/verify/checkMobilePhoneIsRegistered",
            type: "post",
            dataType: "json",
            data: {
                mobilePhone: mobile,
                from: '2'
            },
            success: function (result) {

                if (result.state == "0") {//已注册
                    $(".error_msg").show().html("该手机号已经注册");
                    $(".step_one li").children(".register_liwrap").removeClass("default");
                    $(".step_one li").eq(0).children(".register_liwrap").addClass("default");
                    return false;
                } else {//未注册
                    if (code == null || code == "") {
                        $(".error_msg").show().html("图形验证码不能为空");
                        $(".step_one li").children(".register_liwrap").removeClass("default");
                        $(".step_one li").eq(1).children(".register_liwrap").eq(0).addClass("default");
                        return false;
                    }
                    else {

                        $.ajax({
                            url: ctxpath + "/sm/checkPictureCode",
                            type: "post",
                            dataType: "json",
                            data: {
                                from: '1',
                                key: key,
                                pictureCode: code
                            },
                            success: function (result) {
                                if (result.state == "0") {
                                    if (phoneCode == "") {

                                        $(".error_msg").show().html("短信验证码不能为空");
                                        $(".step_one li").children(".register_liwrap").removeClass("default");
                                        $(".step_one li").eq(3).children(".register_liwrap").addClass("default");
                                        return false;
                                    }
                                    else {
                                        $.ajax({
                                            url: ctxpath + "/sm/verifySmsCode",
                                            type: "post",
                                            dataType: "json",
                                            data: {
                                                mobilePhone: mobile,
                                                smsCode: phoneCode,
                                                from: '1'
                                            },
                                            success: function (result) {
                                                if (result.state == "0") {
                                                    //跳到第二部
                                                    if ($("#agreementLogin").prop("checked") != true) {
                                                        $(".step_one li").children(".register_liwrap").removeClass("default");
                                      

                                                            $(".error_msg").show().html("请您勾选用户服务协议！");
                                                            return false;


                                                    }
                                                    else {
                                                        $(".step_one li").children(".register_liwrap").removeClass("default");

                                                        $(".step_one,#one").hide();
                                                        $(".step_two,#two").show();
                                                        $(".bar").addClass("half");
                                                        $(".register_step li").eq(0).addClass("pass").children("i").html("");
                                                        $(".register_step li").eq(1).addClass("cur");

                                                        currentMobile=mobile;
                                                        _czc.push(['_trackEvent', '注册创建账户', '点击', '下一步']);
                                                    }

                                                } else {
                                                    $(".error_msg").show().html("请输入正确的短信验证码");
                                                    $(".step_one li").children(".register_liwrap").removeClass("default");
                                                    $(".step_one li").eq(3).children(".register_liwrap").addClass("default");
                                                    return false;
                                                }
                                            }
                                        });
                                    }

                                } else {
                                    $(".error_msg").show().html("请输入正确的图形验证码");
                                    $(".step_one li").children(".register_liwrap").removeClass("default");
                                    $(".step_one li").eq(1).children(".register_liwrap").eq(0).addClass("default");
                                    return false;
                                }
                            }
                        });

                    }

                }
            }
        });

    }

}
var flagCheck = false;
/*复选框切换*/
$(".agreement span").click(function () {
 _czc.push(['_trackEvent', '注册创建账户', '点击', '勾选协议']);
    $(this).toggleClass("cur");
    if ($(this).hasClass('cur')) {
        $("#agreementLogin").attr("checked", true);

    }
    else {
        $("#agreementLogin").attr("checked", false);

    }


});


function registTwo() {
    var pwd = $("#pwd").val();
    var pwdRepeat = $("#pwdRepeat").val();
    var recommendMobilePhone = $("#recommendMobilePhone").val();
    if (pwd == "" || pwd == null) {
        $(".error_msg").show().html("密码不能为空");
        $(".step_two li").children(".register_liwrap").removeClass("default");
        $(".step_two li").eq(0).children(".register_liwrap").addClass("default");
        return false;
    }
    else if(!regp.test(pwd)) {
        $(".error_msg").show().html("密码格式为6-16位数字加字母");
        $(".step_two li").children(".register_liwrap").removeClass("default");
        $(".step_two li").eq(0).children(".register_liwrap").addClass("default");
        return false;
    }
    if (pwdRepeat == "" || pwdRepeat == null) {
        $(".error_msg").show().html("密码不能为空");
        $(".step_two li").children(".register_liwrap").removeClass("default");
        $(".step_two li").eq(0).children(".register_liwrap").addClass("default");
        return false;
    }
    else if(!regp.test(pwdRepeat)) {
        $(".error_msg").show().html("密码格式为6-16位数字加字母");
        $(".step_two li").children(".register_liwrap").removeClass("default");
        $(".step_two li").eq(1).children(".register_liwrap").addClass("default");
        return false;
    }

    else if(pwdRepeat!=pwd){
        $(".error_msg").show().html("两次输入的密码必须一致");
        $(".step_two li").children(".register_liwrap").removeClass("default");
        $(".step_two li").eq(1).children(".register_liwrap").addClass("default");
        return false;
    }

    if ($("#agreementLogin").prop("checked") != true) {
        $(".step_two li").children(".register_liwrap").removeClass("default");


        $(".error_msg").show().html("请您勾选用户服务协议！");
        return false;


    }
    else {
        $(".step_two li").children(".register_liwrap").removeClass("default");

    }
// 中投摩根合作方注册入口参数refer.
    var refer = $.cookie('refer');
    if(refer == "" || refer == null) {
        refer = recommendRefer2;
    }
    var id = $.cookie('userid');
    pwd = str_md5(pwd);
    pwd = $.base64.encode(pwd);
        //注册
        $.ajax({
            url: ctxpath + "/newRegist",
            type: "post",
            dataType: "json",
            data: {
                name: currentMobile,
                pwd: pwd,
                recommendMobilePhone: recommendMobilePhone,
                userNo: id,
                refer: refer,
                from: '2'
            },
            success: function(result) {
                if(result.state == "0") {
                    $(".bar").addClass("all");
                    $(".register_step li").eq(0).addClass("pass");
                    $(".register_step li").eq(1).addClass("pass").children("i").html("");
                    $(".register_step li").eq(2).addClass("cur");
                    $(".register_success").show();
                    $(".register_step_group").remove();
                    $.cookie('token', result.token);
                     _czc.push(['_trackEvent', '注册设置密码', '点击', '下一步']);

                }
                if(result.state != "0") {
                    $(".error_msg").show().html(result.message);
                }
            }
        });



}