jQuery.support.cors = true;
var pageNo = parseInt(1);
var pageSize = parseInt(13);

var isSend = true; //是否请求加载图片
$(function() {

	bouns(-1, pageNo, pageSize);
	getUserBouns();
});

//积分明细
function bouns(bounsType, pageNo, pageSize) {

	isSend = false;
	$.ajax({
		url: ctxpath + "/bouns/userBounsHistory ",
		type: "post",
		dataType: "json",
		data: {
			from: '2',
			token: token,
			pageNo: pageNo,
			pageSize: pageSize,
			bounsType: bounsType // 0 出借     1注册  2邀请好友  3签到   4积分抽奖 5 积分兑换  6好友投资返积分 7流标     全部-1   积分获得1,积分消耗2
		},
		success: function(json) {

			if(json.state == 0) {

				var htm = "";

				if(json.data.userBounsHistory.length > 0) {
					$.each(json.data.userBounsHistory, function(index, item) {
						var amount = item.amount;
						htm += '<ul class="clear">' +
							'<li class="fl">' + item.number + '</li>' +
							'<li class="fl">' + item.bounsType + '</li>';
						if(amount < 0) { //减分
							htm += '<li class="fl reduce">' + amount + '</li>';
						} else {
							htm += '<li class="fl  add">+' + amount + '</li>';
						}
						htm += '<li class="fl">' + item.score + '</li>' +
							'<li class="fl">' + item.createDate + '</li>' +
							'</ul>';
					});

					$(".points_ul").html(htm);
					//分页
					if(json.data.pageCount > 1) {
						$('#light-pagination').show();
						$('#light-pagination').pagination({
							pages: json.data.pageCount,
							currentPage: json.data.pageNo, //当前页
							onPageClick: function(pageNo) {
								bouns(bounsType, pageNo, pageSize)
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

				} else { //无记录
					$(".points_null").show();

				}
				isSend = true;
			} else {
				window.location.href = "login.html";
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
		success: function(result) {
			if(result.state == '0') {
				$("#userbouns").html("我的积分:" + result.data.score + "积分");
			} else {
				$.cookie('token', null);
				window.location.href = "login.html";
			}
		}
	});
}

/*暂无记录*/
function getNoneMsg() {
	$(".news_null_wrap").show();
}