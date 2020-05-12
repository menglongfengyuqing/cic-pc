jQuery.support.cors = true;
var pageNo = parseInt(1);
var pageSize = parseInt(10);

$(function() {
	getUserBrokerage(); //邀请好友
	customerBrokerageInfo(); //邀请好友人数
	getUserFriendsBouns(); //返利积分
	getTransDetails(pageNo, pageSize); //奖励详情
});

function customerBrokerageInfo() {

	// 调用接口.
	$.ajax({
		url: ctxpath + "/activity/getInviteFriends",
		type: 'post',
		dataType: 'json',
		data: {
			token: token,
			from: '2'
		},
		success: function(json) {
			// 系统超时.
			if(json.state == 4) {
				logout();
			}
			// 接口调用成功.
			if(json.state == 0) {
				$("#countusers").html(json.data.inviteFriends + "<em>人</em>");
			}
		}
	});
}

//获取用户推荐好友返利总积分
function getUserFriendsBouns() {
	// 调用接口.
	$.ajax({
		url: ctxpath + "/bouns/getUserFriendsBouns",
		type: 'post',
		dataType: 'json',
		data: {
			token: token,
			from: '2'
		},
		success: function(json) {
			// 系统超时.
			if(json.state == 4) {
				logout();
			}
			// 接口调用成功.
			if(json.state == 0) {
				$("#sumbrokerage").html(json.data.bounsTotalAmount + "<em>分</em>"); // 总佣金
			}
		}
	});
}

// 邀请好友佣金
function getUserBrokerage() {

	$.ajax({
		url: ctxpath + "/activity/getUserBrokerage",
		type: "post",
		dataType: "json",
		data: {
			from: '1',
			token: token
		},
		success: function(result) {
			if(result.state == 4) {
				logout();
			}
			var data = result.data;

			// $("#userinvest").html(formatCurrency(data.bidTotalAmount) + "<em>元</em>"); // 邀请好友总投资金额

			$("#link").val(server_path + "register.html?id=" + data.inviteMobilePhone);

			$("#copyUrl").zclip({
				path: server_path + 'js/zclip/ZeroClipboard.swf',
				copy: function() {
					
					return $('#link').val();
				},
				afterCopy: function() {
					$('.link em').addClass("cur");
				
					//					if($(".link em").hasClass("cur")) {
					//						setTimeout(function() {
					//							$(".link em").removeClass("cur");
					//						}, 3000);
					//					}
				}
			});

		}
	});
}


// 奖励详情
function getTransDetails(pageNo, pageSize) {
	$.ajax({
		url: ctxpath + "/user/findMyFriendsInvestList",
		type: "post",
		dataType: "json",
		data: {
			from: '1',
			token: token,
			pageNo: pageNo,
			pageSize: pageSize,
		},
		success: function(result) {
			if(result.state == "4") { // 系统超时.
				logout();
			}
			var str = '<li><b>好友</b><b>注册时间</b><b>累计出借（元）</b><b>我的奖励</b></li>';
			if(result.state == "0") {
				// 好友累计出借金额
				$("#userinvest").html(formatCurrency(result.data.myFriendsInvestTotalAmount) + "<em>元</em>");
				var detailList = result.data.bounsHistoryList;
				if(detailList != null && detailList.length > 0) {
					$.each(detailList, function(index, item) {
						str += '<li>' +
							'<span>' + item.phone + '</span>' +
							'<span>' + item.registerDateTime + '</span>' +
							'<span>' + item.investTotalAmount + '</span>' +
							'<span>' + item.amount + '积分</span>' +
							'</li>';
					});
					if(result.data.pageCount > 1) {
						$('#light-pagination').show();
						$('#light-pagination').pagination({
							pages: result.data.pageCount,
							currentPage: result.data.pageNo, //当前页
							onPageClick: function(pageNo) {
								getTransDetails(pageNo, pageSize);
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
					$(".invite_table ul").html(str);
				} else {
					$('.pagination_holder').hide();
					$(".invite_table ul").html('<div class="news_null">暂无邀请好友记录哟~</div>');
					$(".news_null").show();
				}
			} else {
				$('.pagination_holder').hide();
				$(".invite_table ul").html('<div class="news_null">暂无邀请好友记录哟~</div>');
				$(".news_null").show();
			}

		}
	});

}