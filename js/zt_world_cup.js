jQuery.support.cors = true;
var click = true;
/*banner scroll*/
$(function() {

	if(token != null && token.trim().length > 0) {
		//优惠券状态展示
		getWorldCupVouAmountList();
	}

	var date = new Date();
	var year = date.getFullYear(); //获取当前年份   
	var mon = date.getMonth() + 1; //获取当前月份   
	var da = date.getDate(); //获取当前日   
	var day = date.getDay(); //获取当前星期几   
	var h = date.getHours(); //获取小时   
	var m = date.getMinutes(); //获取分钟   
	var s = date.getSeconds(); //获取秒   
	console.log('当前时间:' + year + '-' + mon + '-' + da);
	$(".ranking_tab li").each(function(index, item) {
		var dataS = da + "日";
		var str = item.innerHTML;
		if(str == dataS) {
			$(this).addClass("cur").siblings().removeClass("cur");
		}
	});

	//用户排行榜
	worldCupInvest(year + '-' + mon + '-' + da);

});
$(".ranking_tab li").click(function() {
	$(this).addClass("cur").siblings().removeClass("cur");
});

$("#vou10").one("click", function() {
	getWorldCupVouAmount(10);
});

$("#vou20").one("click", function() {
	getWorldCupVouAmount(20);
});

$("#vou30").one("click", function() {
	getWorldCupVouAmount(30);
});

$("#vou50").one("click", function() {
	getWorldCupVouAmount(50);
});

$("#vou100").one("click", function() {
	getWorldCupVouAmount(100);
});

$("#vou200").one("click", function() {
	getWorldCupVouAmount(200);
});

//优惠券状态
function getWorldCupVouAmountList() {
	$.ajax({
		url: ctxpath + "/activity/getWorldCupVouAmountList",
		type: 'post',
		dataType: 'json',
		data: {
			from: '1',
			token: token
		},
		success: function(result) {
			if(result.state == 0) {
				var list = result.list;

				$.each(list, function(index, item) {
					var amount = item.amount;
					amount = parseInt(amount);
					if(amount == 10) {
						$(".wc_coupon_li01").addClass("cur");
						$(".wc_coupon_li01").children("em").html("已领取");
					} else if(amount == 20) {
						$(".wc_coupon_li02").addClass("cur");
						$(".wc_coupon_li02").children("em").html("已领取");
					} else if(amount == 30) {
						$(".wc_coupon_li03").addClass("cur");
						$(".wc_coupon_li03").children("em").html("已领取");
					} else if(amount == 50) {
						$(".wc_coupon_li04").addClass("cur");
						$(".wc_coupon_li04").children("em").html("已领取");
					} else if(amount == 100) {
						$(".wc_coupon_li05").addClass("cur");
						$(".wc_coupon_li05").children("em").html("已领取");
					} else if(amount == 200) {
						$(".wc_coupon_li06").addClass("cur");
						$(".wc_coupon_li06").children("em").html("已领取");
					} else {
						console.log(error);
					}

				});
			} else {
				$.cookie('token', null);
			}
		}

	});
}

//优惠券领取
function getWorldCupVouAmount(vouAmount) {
	if(token != null && token.trim().length > 0) {

		$.ajax({
			url: ctxpath + "/activity/getWorldCupVouAmount",
			type: 'post',
			dataType: 'json',
			data: {
				from: '1',
				token: token,
				vouAmount: vouAmount

			},
			success: function(result) {
				if(result.state == 0) {

					$(".mask_drop,.mask_coupon").show();
					$("#couponAmount").html(vouAmount + "元");

					if(vouAmount == 10) {
						$(".wc_coupon_li01").addClass("cur");
						$(".wc_coupon_li01").children("em").html("已领取");
					} else if(vouAmount == 20) {
						$(".wc_coupon_li02").addClass("cur");
						$(".wc_coupon_li02").children("em").html("已领取");
					} else if(vouAmount == 30) {
						$(".wc_coupon_li03").addClass("cur");
						$(".wc_coupon_li03").children("em").html("已领取");
					} else if(vouAmount == 50) {
						$(".wc_coupon_li04").addClass("cur");
						$(".wc_coupon_li04").children("em").html("已领取");
					} else if(vouAmount == 100) {
						$(".wc_coupon_li05").addClass("cur");
						$(".wc_coupon_li05").children("em").html("已领取");
					} else if(vouAmount == 200) {
						$(".wc_coupon_li06").addClass("cur");
						$(".wc_coupon_li06").children("em").html("已领取");
					} else {
						console.log(error);
					}

				} else if(result.state == 3) {
					console.log("您已领取过此抵用券");
					//					$(".mask_drop,.mask_coupon").show();
					//					$("#couponAmount").html(vouAmount + "元");

				} else {
					$.cookie('token', null);
					window.location.href = "login.html";
				}
			}
		});
	} else {
		window.location.href = "login.html";
	}
}

//用户排行榜
function worldCupInvest(date) {
	$.ajax({
		url: ctxpath + "/app/worldCupInvest",
		type: 'post',
		dataType: 'json',
		data: {
			from: '1',
			date: date
		},
		success: function(result) {
			if(result.state == 0) {
				var data = result.data.investList;
				var str = '<tr>' +
					'<th>排名</th>' +
					'<th>用户名</th>' +
					'<th>当日出借金额</th>' +
					'<th>首投时间</th>' +
					'</tr>';
				if(data == "" || data == null) {
					str += '<tr  class="ranking_noenough">' +
						'<td>暂无数据</td>' +
						'</tr>'
					'</table>';
				} else {
					$.each(data, function(index, item) {

						str += '<tr>' +
							'<td>' + (index + 1) + '</td>' +
							'<td>' + item.phone + '</td>' +
							'<td>' + item.amount + '</td>' +
							'<td>' + item.investDate + '</td>' +
							'</tr>';
					});
				}

				$("#worldCupInvest .ranking_con_tab table").html(str);

			} else {
				console.log(result.message);
			}

		}

	});
}

//关闭弹窗
$(".mask_drop").click(function() {
	$(this).hide();
	$(".mask_coupon").hide();
});