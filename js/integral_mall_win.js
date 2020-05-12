jQuery.support.cors = true;
var pageNo = parseInt(1);
var pageSize = parseInt(5);
var awardGetType = null;
var isTrue = null;
var myPoints = 0;
//var myPointsUsed=0;
var totalAmount = 0;
$(function() {
	if(token != null && token.trim().length > 0) {
		$("#score_game").attr("href", "integral_mall_game.html");
		$("#score_change").attr("href", "integral_mall_win.html");
		$("#myPoints").show();
	} else {
		$("#score_game").attr("href", "login.html");
		$("#score_change").attr("href", "login.html");
		$("#myPoints").hide();
	}
	getUserBouns();
	userAwardList(pageNo, pageSize, null, null);

});

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
		success: function(result) {
			if(result.state == '0') {
				$("#myPoints").html("我的积分：" + result.data.score + '<i></i>').click(function() {
					window.location.href = "integral_mall_points.html";
				});
			} else {
				logout();
			}
		}
	});
}
//我的奖品
function userAwardList(pageNo, pageSize, awardGetType, isTrue) {

	$.ajax({
		url: ctxpath + "/awardInfo/newUserAwardList",
		type: "post",
		dataType: "json",
		data: {
			from: '2',
			token: token,
			pageNo: pageNo,
			pageSize: pageSize,
			awardGetType: awardGetType, //0 抽奖 1 兑奖 null 全部
			isTrue: isTrue //0 实物 1抵用券 null全部
		},
		success: function(json) {

			console.log(json)
			if(json.state == 0) {

				var htm = '';
				if(json.state == 0 && json.data.awardlist.length > 0) {
					$.each(json.data.awardlist, function(index, value) {
						if(value.isTrue == 0) { //实物

							if(value.state == 0) {
								htm += '<li>' +
									'<a href="integral_mall_order.html?userAwardId=' + value.myAwardId + '&awardId=' + value.awardId + '">' +
									'<div class="prize_win_img fl">' +
									'<img src="' + value.awardimgWeb + '"alt="" onerror="imgError(this)">' +
									'</div>' +
									'<div class="prize_win_detalis fl">';
								if(value.awardNeedAmount == 0) { //积分抽奖
									htm += '<h4><span class="fl">' + value.awardName + '</span><b>积分抽奖</b></h4>';
								} else {
									htm += '<h4><span class="fl">' + value.awardName + '</span><b>积分兑换</b></h4>';
								}

								htm += '<h5><span>快递包邮</span><span>不支持退换</span></h5>' +
									'<p><span>兑换时间:' + value.awardDate + '</span><b>失效时间：' + value.deadline + '</b></p>' +
									'</div>' +
									'<div class="prize_point fr">';
								if(value.awardNeedAmount == 0) { //积分抽奖
									htm += '<span>积分:10</span>';
								} else {
									htm += '<span>积分:' + value.awardNeedAmount + '</span>';
								}

								htm += '<span>数量X1</span>' +
									'<a href="integral_mall_order.html?userAwardId=' + value.myAwardId + '&awardId=' + value.awardId + '" ><em>待下单</em></a>';

							} else if(value.state == 1) {
								htm += '<li>' +
									'<a href="integral_mall_order.html?userAwardId=' + value.myAwardId + '&awardId=' + value.awardId + '">' +
									'<div class="prize_win_img fl">' +
									'<img src="' + value.awardimgWeb + '"alt="" onerror="imgError(this)">' +
									'</div>' +
									'<div class="prize_win_detalis fl">';
								if(value.awardNeedAmount == 0) { //积分抽奖
									htm += '<h4><span class="fl">' + value.awardName + '</span><b>积分抽奖</b></h4>';
								} else {
									htm += '<h4><span class="fl">' + value.awardName + '</span><b>积分兑换</b></h4>';
								}

								htm += '<h5><span>快递包邮</span><span>不支持退换</span></h5>' +
									'<p><span>兑换时间:' + value.awardDate + '</span><b>失效时间：' + value.deadline + '</b></p>' +
									'</div>' +
									'<div class="prize_point fr">';
								if(value.awardNeedAmount == 0) { //积分抽奖
									htm += '<span>积分:10</span>';
								} else {
									htm += '<span>积分:' + value.awardNeedAmount + '</span>';
								}

								htm += '<span>数量X1</span>' +
									'<a href="integral_mall_order.html?userAwardId=' + value.myAwardId + '&awardId=' + value.awardId + '" ><em class="default">已下单</em></a>';

							} else if(value.state == 2) {
								htm += '<li>' +
									'<a href="integral_mall_order.html?userAwardId=' + value.myAwardId + '&awardId=' + value.awardId + '">' +
									'<div class="prize_win_img fl">' +
									'<img src="' + value.awardimgWeb + '"alt="" onerror="imgError(this)">' +
									'</div>' +
									'<div class="prize_win_detalis fl">';
								if(value.awardNeedAmount == 0) { //积分抽奖
									htm += '<h4><span class="fl">' + value.awardName + '</span><b>积分抽奖</b></h4>';
								} else {
									htm += '<h4><span class="fl">' + value.awardName + '</span><b>积分兑换</b></h4>';
								}

								htm += '<h5><span>快递包邮</span><span>不支持退换</span></h5>' +
									'<p><span>兑换时间:' + value.awardDate + '</span><b>失效时间：' + value.deadline + '</b></p>' +
									'</div>' +
									'<div class="prize_point fr">';
								if(value.awardNeedAmount == 0) { //积分抽奖
									htm += '<span>积分:10</span>';
								} else {
									htm += '<span>积分:' + value.awardNeedAmount + '</span>';
								}

								htm += '<span>数量X1</span>' +
									'<a href="integral_mall_order.html?userAwardId=' + value.myAwardId + '&awardId=' + value.awardId + '" ><em class="default">已发货</em></a>';

							} else if(value.state == 3) {
								htm += '<li class="finishBtn">' +
									'<a href="javascript:;">' +
									'<div class="prize_win_img fl">' +
									'<img src="' + value.awardimgWeb + '"alt="" onerror="imgError(this)">' +
									'</div>' +
									'<div class="prize_win_detalis fl">';
								if(value.awardNeedAmount == 0) { //积分抽奖
									htm += '<h4><span class="fl">' + value.awardName + '</span><b>积分抽奖</b></h4>';
								} else {
									htm += '<h4><span class="fl">' + value.awardName + '</span><b>积分兑换</b></h4>';
								}

								htm += '<h5><span>快递包邮</span><span>不支持退换</span></h5>' +
									'<p><span>兑换时间:' + value.awardDate + '</span><b>失效时间：' + value.deadline + '</b></p>' +
									'</div>' +
									'<div class="prize_point fr">';
								if(value.awardNeedAmount == 0) { //积分抽奖
									htm += '<span>积分:10</span>';
								} else {
									htm += '<span>积分:' + value.awardNeedAmount + '</span>';
								}
								htm += '<span>数量X1</span>' +
									'<a href="javascript:;"><em class="default">已结束</em></a>';

							} else if(value.state == 4) {
								htm += '<li class="finishBtn">' +
									'<a href="javascript:;">' +
									'<div class="prize_win_img fl">' +
									'<img src="' + value.awardimgWeb + '"alt="" onerror="imgError(this)">' +
									'</div>' +
									'<div class="prize_win_detalis fl">';
								if(value.awardNeedAmount == 0) { //积分抽奖
									htm += '<h4><span class="fl">' + value.awardName + '</span><b>积分抽奖</b></h4>';
								} else {
									htm += '<h4><span class="fl">' + value.awardName + '</span><b>积分兑换</b></h4>';
								}

								htm += '<h5><span>快递包邮</span><span>不支持退换</span></h5>' +
									'<p><span>兑换时间:' + value.awardDate + '</span><b>失效时间：' + value.deadline + '</b></p>' +
									'</div>' +
									'<div class="prize_point fr">';
								if(value.awardNeedAmount == 0) { //积分抽奖
									htm += '<span>积分:10</span>';
								} else {
									htm += '<span>积分:' + value.awardNeedAmount + '</span>';
								}

								htm += '<span>数量X1</span>' +
									'<a href="javascript:;" ><em class="default">已兑现</em></a>';

							} else if(value.state == 5) {
								htm += '<li class="finishBtn">' +
									'<a href="javascript:;">' +
									'<div class="prize_win_img fl">' +
									'<img src="' + value.awardimgWeb + '"alt="" onerror="imgError(this)">' +
									'</div>' +
									'<div class="prize_win_detalis fl">';
								if(value.awardNeedAmount == 0) { //积分抽奖
									htm += '<h4><span class="fl">' + value.awardName + '</span><b>积分抽奖</b></h4>';
								} else {
									htm += '<h4><span class="fl">' + value.awardName + '</span><b>积分兑换</b></h4>';
								}

								htm += '<h5><span>快递包邮</span><span>不支持退换</span></h5>' +
									'<p><span>兑换时间:' + value.awardDate + '</span><b>失效时间：' + value.deadline + '</b></p>' +
									'</div>' +
									'<div class="prize_point fr">';
								if(value.awardNeedAmount == 0) { //积分抽奖
									htm += '<span>积分:10</span>';
								} else {
									htm += '<span>积分:' + value.awardNeedAmount + '</span>';
								}

								htm += '<span>数量X1</span>' +
									'<a href="javascript:;"><em class="default">已失效</em></a>';
							}
							htm += '</div>' +
								'</a>' +
								'</li>';
						} else {

							if(value.state == 1) {
								htm += '<li>' +
									'<a href="invest_home.html">' +
									'<div class="prize_win_img fl">' +
									'<img src="' + value.awardimgWeb + '"alt="" onerror="imgError(this)">' +
									'</div>' +
									'<div class="prize_win_detalis fl">';
								if(value.awardNeedAmount == 0) { //积分抽奖

									htm += '<h4><span class="fl">' + value.awardName + '</span><b>积分抽奖</b></h4>';
								} else {
									htm += '<h4><span class="fl">' + value.awardName + '</span><b>积分兑换</b></h4>';
								}

								htm += '<h5><span>' + value.docs + '</span></h5>' +
									'<p><span>兑换时间:' + value.awardDate + '</span><b>失效时间：' + value.deadline + '</b></p>' +
									'</div>' +
									'<div class="prize_point fr">';
								if(value.awardNeedAmount == 0) { //积分抽奖
									htm += '<span>积分:10</span>';
								} else {
									htm += '<span>积分:' + value.awardNeedAmount + '</span>';
								}
								htm += '<span>数量X1</span>' +
									'<a href="invest_home.html" onclick="_czc.push([\'_trackEvent\', \'我的奖品列表\', \'点击\', \'待使用等状态按钮\'])"><em>待使用</em></a>';
							} else if(value.state == 2) {
								htm += '<li class="finishBtnUse">' +
									'<a href="javascript:;">' +
									'<div class="prize_win_img fl">' +
									'<img src="' + value.awardimgWeb + '"alt="" onerror="imgError(this)">' +
									'</div>' +
									'<div class="prize_win_detalis fl">';
								if(value.awardNeedAmount == 0) { //积分抽奖

									htm += '<h4><span class="fl">' + value.awardName + '</span><b>积分抽奖</b></h4>';
								} else {
									htm += '<h4><span class="fl">' + value.awardName + '</span><b>积分兑换</b></h4>';
								}

								htm += '<h5><span>' + value.docs + '</span></h5>' +
									'<p><span>兑换时间:' + value.awardDate + '</span><b>失效时间：' + value.deadline + '</b></p>' +
									'</div>' +
									'<div class="prize_point fr">';
								if(value.awardNeedAmount == 0) { //积分抽奖
									htm += '<span>积分:10</span>';
								} else {
									htm += '<span>积分:' + value.awardNeedAmount + '</span>';
								}
								htm += '<span>数量X1</span>' +
									'<a href="javascript:;" ><em class="default">已使用</em></a>';

							} else if(value.state == 3) {
								htm += '<li class="finishBtnOver">' +
									'<a href="javascript:;">' +
									'<div class="prize_win_img fl">' +
									'<img src="' + value.awardimgWeb + '"alt="" onerror="imgError(this)">' +
									'</div>' +
									'<div class="prize_win_detalis fl">';
								if(value.awardNeedAmount == 0) { //积分抽奖

									htm += '<h4><span class="fl">' + value.awardName + '</span><b>积分抽奖</b></h4>';
								} else {
									htm += '<h4><span class="fl">' + value.awardName + '</span><b>积分兑换</b></h4>';
								}

								htm += '<h5><span>' + value.docs + '</span></h5>' +
									'<p><span>兑换时间:' + value.awardDate + '</span><b>失效时间：' + value.deadline + '</b></p>' +
									'</div>' +
									'<div class="prize_point fr">';
								if(value.awardNeedAmount == 0) { //积分抽奖
									htm += '<span>积分:10</span>';
								} else {
									htm += '<span>积分:' + value.awardNeedAmount + '</span>';
								}
								htm += '<span>数量X1</span>' +
									'<a href="javascript:;" ><em class="default">已过期</em></a>';
							}
							htm += '</div>' +
								'</a>' +
								'</li>';
						}
					});

					$('#myAwardList').html(htm);
					$(".finishBtn").click(function() {
						getMsg('商品已失效，看看别的商品吧～');
					});
					$(".finishBtnUse").click(function() {
						getMsg('优惠券已使用，看看别的商品吧～');
					});
					$(".finishBtnOver").click(function() {
						getMsg('优惠券已过期，看看别的商品吧～');
					});
					//分页
					if(json.data.pageCount > 1) {
						$('#light-pagination').show();
						$('#light-pagination').pagination({
							pages: json.data.pageCount,
							currentPage: json.data.pageNo, //当前页
							onPageClick: function(pageNo) {
								userAwardList(pageNo, pageSize, awardGetType, isTrue);
							},
							onInit: function() {
								$('.prev').removeClass('current');
								$('.next').removeClass('current');
							},
							cssStyle: 'light-theme'
						});
					} else {
						$('#light-pagination').hide();
					}
				} else {
					getNoneMsg();
					$('#myAwardList').html("");
				}
			} else {
				window.location.href = "login.html";
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
/*暂无记录*/
function getNoneMsg() {
	$(".win_product_null").show();
	$('.pagination_holder,#myAwardList').hide();
}

function imgError(image) {
	image.src = "images/integral_mall/white.png";
}