var score;
var awardScore;
var awardId
$(function () {
    awardId = getArgumentsByName("id");
    detail(awardId);
});

/**
 * 奖品详情
 * @param {Object} awardId
 */
function detail(awardId) {

    //奖品详情
    $.ajax({
        url: ctxpath + "/awardInfo/getAwardInfo",
        type: "post",
        dataType: "json",
        data: {
            from: '2',
            awardId: awardId
        },
        success: function (result) {
            if (result.state == "0") {
                var obj = result.data;
                awardScore = obj.needAmount;
                var htm = "";
                var awardStandard = obj.awardStandard;
                var isTrue = obj.isTrue;
                if (awardStandard == null) {
                    awardStandard = "";
                }

                htm += '<div class="lpd_l fl">' +
                    '<img src="' + obj.imgWeb + '" alt="" >' +
                    '</div>' +
                    '<div class="fr lpd_r">';
                if(isTrue == "0") { //实物
                    htm += '<h3 id="mall_name"><i>商品</i>'+obj.name+'</h3>';
                }
                else{ //虚拟
                    htm += '<h3 id="mall_name"><i>红包</i>'+obj.name+'</h3>';
                }
                htm += '<div class="imp_introduce">'+ obj.name + '</span>' + obj.docs + '' + awardStandard + '</div>' +
                    '<dl>' +
                    '<dt class="fl">消耗积分：</dt>' +
                    '<dd class="fl"><span id="mall_integral">'+ obj.needAmount +'</span></dd>' +
                    '</dl>' +
                    '<dl>' +
                    '<dt class="fl">兑换说明:</dt>' +
                    '<dd class="fl">' +
                    '<p>•&nbsp;积分商城所有上架商品，用户获取形式分别为抽奖（10积分/次），和用商品所标注相应积分进行兑换。</p>' +
                    '<p>•&nbsp;用户在积分商城所抽取商品不允许做任何形式变更，均以抽到奖品为准。</p>' +
                    '<p>•&nbsp;用户抽到或者兑换奖品之后，切记认真填写收货地址，若地址没有或不明，平台不予采购寄送。</p>' +
                    '<p>•&nbsp;如您在积分商城的体验中所遇到任何疑问，请咨询平台客服，最终说明以平台微信客服为准。</p>' +
                    '</dd>' +
                    '</dl>' +
                    '<dl><span class="lotterry_exchange" onclick="conversion()" ondblclick="copyText()">立即兑换</span></dl>'+
                   '</div>';


                $(".lp_details").html(htm);



            } else {
                console.log(result.message);
            }
        }
    });
}

// 获得用户积分值
function getUserBouns() {
    $.ajax({
        url: ctxpath + "/bouns/userBouns",
        type: 'post',
        dataType: 'json',
        data: {
            from: "1",
            token: token
        },
        success: function (result) {
            if (result.state == '0') {
                score = result.data.score;
                if (score < awardScore) {
                }
            } else {
                //去登录
                logout();
            }
        }
    });
}

var clickTimer = null;

/**
 * 奖品兑换
 *
 * @param {Object}
 *            needAmount
 */
function conversion() {
_czc.push(['_trackEvent', '商品详情', '点击', '推荐产品']);
    if (clickTimer) {
        window.clearTimeout(clickTimer);
        clickTimer = null;
    }

    clickTimer = window.setTimeout(function () {
        // 校验token 是否存在，不存在去登录页面
        if (token == null || token.trim().length <= 0) {
            logout();
            return false;
        }

        $.ajax({
            url: ctxpath + "/awardInfo/awardToUser",
            type: "post",
            dataType: "json",
            data: {
                awardId: awardId,
                from: '1',
                token: token,
                needAmount: awardScore
            },
            success: function (result) {
                if (result.state == "0") {
                    var obj = result.data;
                    if (obj.awardIsTrue == "1") { // 虚拟商品
                        // getMsg("兑换成功");
                        // setTimeout(function(){
                            window.location = "integral_mall_win.html";
                        // },2000);



                    } else {//实物商品
                        // getMsg("兑换成功");
                        // setTimeout(function(){
                            window.location = "integral_mall_order.html?userAwardId=" + obj.userAwardId;
                        // },2000);
                    }
                } else if (result.state == "3") {
                    // 积分不足
                    $(".mask_drop ,.mask_points_wrap").show();

                }
            }
        });
    }, 500);

}
/*积分不足按钮*/
$(".points_less span,.points_less a").click(function () {
    $(".mask_drop,.points_less").hide();
    _czc.push(['_trackEvent', '积分不足弹窗', '点击', '关闭按钮/我知道了']);
});




//二次点击，提示消息.
function copyText() {

    if (clickTimer) {
        window.clearTimeout(clickTimer);
        clickTimer = null;
    }

    console.log("奖品兑换二次点击");
    // 请勿重复点击.
    getMsg("请勿重复点击！");
    setTimeout(function () {
        $(".mask_investNo_tip").hide();
    }, 2000);
}//错误提示
function getMsg(str) {

    $(".mask_tip").show().html(str);
    setTimeout(function() {
        $(".mask_tip").hide();
    }, 2000);
}