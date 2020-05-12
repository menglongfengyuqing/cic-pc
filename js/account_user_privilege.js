jQuery.support.cors = true;
var pageNo = parseInt(1);
var pageSize = parseInt(3);
var registUrl = "https://www.cicmorgan.com/login.html";
var couponType = '1'; //1未使用，2已使用，3已过期
/**
 * 全部.
 */
var COUPON_STATE_0 = 0;
/**
 * 可使用.
 */
var COUPON_STATE_1 = 1;
/**
 * 已使用.
 */
var COUPON_STATE_2 = 2;
/**
 * 已过期.
 */
var COUPON_STATE_3 = 3;

$(function() {
	// 优惠券tab卡切换.
	$(".coupon_tab li a").click(function(event) {
		$(this).addClass('cur').parent().siblings().children("a").removeClass('cur');
	});

	// 我的抵用券列表.
	accountCoupon(couponType,pageNo,pageSize);

	getUserBrokerage(); //邀请好友
	customerBrokerageInfo(); //邀请好友人数
	getUserFriendsBouns();//返利积分

	getTransDetails(pageNo, pageSize); //奖励详情
});



//获取抵用券列表
function accountCoupon(couponType,pageNo,pageSize) {

	// --
	var couponContent = $('#couponList');
	// 每次请求之前删除之前页面的缓存内容.
	couponContent.empty();
	// 调用客户优惠券接口.
	$.ajax({
		url: ctxpath + "/activity/getUserVouchersList",
		type: 'post',
		
		dataType: 'json',
		data: {
			token: token,
			from: '1',
			pageNo : pageNo,
		pageSize : pageSize,
			state: couponType
		},
		success: function(json) {
			// 系统超时.
			if(json.state == 4) {
				logout();
			}

			// 接口调用成功.
			if(json.state == 0) {
				var content = '';
				if(json.data.vouchersList != null && json.data.vouchersList.length > 0) {
					$('#light-pagination_coupon').show();
					$("#noCoupon").hide();
					if(couponType == '1') { //未使用
						$.each(json.data.vouchersList, function(index, item) {
							content += '<li class="fl coupon_using">' +
								'<dl>' +
								'<dt>' + item.amount + '元现金券</dt>' +
								'<dd>'+item.spans+'</dd>'+
								'<dd>有效期：' + item.getDate.substr(0, 10) + '~' + item.overdueDate.substr(0, 10) + '</dd>' +
								'<dd>使用条件:起投' + item.limitAmount + '可用</dd>' +
								'<dd class="coupon_use_btn">' +
								'<a href="invest_home.html">立即使用>></a>' +
								'</dd>' +
								'</dl>' +
								'</li>';
						});
					}
					if(couponType == '2') { //已使用
						$.each(json.data.vouchersList, function(index, item) {
							if(item.state == '2') {
								content += '<li class="fl coupon_used">' +
									'<dl>' +
									'<dt>' + item.amount + '元现金券</dt>' +
									'<dd>'+item.spans+'</dd>'+
									'<dd>有效期：' + item.getDate.substr(0, 10) + '~' + item.overdueDate.substr(0, 10) + '</dd>' +
									'<dd>使用条件:起投' + item.limitAmount + '可用</dd>' +
									'</dl>' +
									'</li>';
							}
						});
					}
					if(couponType == '3') { //已过期
						$.each(json.data.vouchersList, function(index, item) {
							content += '<li class="fl coupon_over">' +
								'<dl>' +
								'<dt>' + item.amount + '元现金券</dt>' +
								'<dd>'+item.spans+'</dd>'+
								'<dd>有效期：' + item.getDate.substr(0, 10) + '~' + item.overdueDate.substr(0, 10) + '</dd>' +
								'<dd>使用条件:起投' + item.limitAmount + '可用</dd>' +
								'</dl>' +
								'</li>';
						});
					}
					couponContent.append(content);


//分页
				if(json.data.pageCount > 1) {
					$('#light-pagination_coupon').show();
					$('#light-pagination_coupon').pagination({
						pages: json.data.pageCount,
						currentPage: json.data.pageNo, //当前页
						onPageClick: function(pageNo) {
							accountCoupon(couponType,pageNo, pageSize);
						},
						onInit: function() {
							$('.prev').removeClass('current');
							$('.next').removeClass('current');
						},
						cssStyle: 'light-theme'
					});
				} else {
					$('#light-pagination_coupon').hide();
				}
				} else {
					$('#light-pagination_coupon').hide();
					$("#noCoupon").show();
				}
			}
		}
	});
}

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
				$("#countusers").html(json.data.inviteFriends + "人");
//				$("#sumbrokerage").html(formatCurrency(json.data.brokerage) + "元"); // 总佣金

			}
		}
	});
}

//获取用户推荐好友返利总积分
function getUserFriendsBouns(){
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
				$("#sumbrokerage").html(json.data.bounsTotalAmount + "分"); // 总佣金

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


			$("#userinvest").html(formatCurrency(data.bidTotalAmount) + "元"); // 邀请好友总投资金额


			$(".copy_link input").val(server_path + "login.html?id=" + data.userId);

			$("#copyUrl").zclip({
				path: server_path + '/js/zclip/ZeroClipboard.swf',
				copy: function() {
					return $('.copy_link input').val();
				},
				afterCopy: function() {
					$('.copy_link span').css("background", "url(" + server_path + "images/account/link_cur.png) no-repeat right center");
					setTimeout("$('.copy_link span').css('background','url(" + server_path + "images/account/link.png)') no-repeat right center", 2000);
				}
			});

		}
	});
}

// 奖励详情
function getTransDetails(pageNo, pageSize) {
	$.ajax({
		url: ctxpath + "/bouns/userBounsHistory",
		type: "post",
		dataType: "json",
		data: {
			from: '1',
			token: token,
			pageNo: pageNo,
			pageSize: pageSize,
			bounsType:6
		},
		success: function(result) {

			var str = '<tr><th>序列</th><th>事件类型</th><th>邀请积分</th></tr>';
			if(result.state == "0") {
				var detailList = result.data;
				if(detailList != null && detailList.length > 0) {
					$('#light-pagination_02').show();
					$("#noFriends").hide();
					$.each(detailList, function(index, item) {
						if(index % 2 == 0) {
							str += '<tr class="odd">';
						} else {
							str += '<tr>';
						}
						str += '<td>' + parseInt(index + 1) + '</td>' +
							'<td>' + item.bounsType + '</td>' +
							'<td>' + formatCurrency(item.amount) + '</td>' +
							'</tr>';
					});
					

					if(result.data.last > 1) {
						$('#light-pagination_02').show();
						$('#light-pagination_02').pagination({
							pages: result.data.last,
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
					}else{
						$('#light-pagination_02').hide();
					}
				}else{
					$('#light-pagination_02').hide();
					$("#noFriends").show();
				}

			}
			$('#light-pagination_02').hide();
			$("#transDetails").html(str);

		}
	});
	
	
	
}