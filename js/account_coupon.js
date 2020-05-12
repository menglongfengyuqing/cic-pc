jQuery.support.cors = true;
var pageNo = parseInt(1);
var pageSize = parseInt(6);
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
	$(".home_r_tab li").click(function(event) {
		$(this).addClass('cur').siblings().removeClass('cur');
	});
	// 我的抵用券列表.
	accountCoupon(couponType, pageNo, pageSize);

});

//获取抵用券列表
function accountCoupon(couponType, pageNo, pageSize) {

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
			pageNo: pageNo,
			pageSize: pageSize,
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
								'<dt>' + item.amount + '元抵用券</dt>' +
								'<dd>项目期限:' + item.spans + '</dd>' +
								'<dd>出借金额:起投' + item.limitAmount + '可用</dd>' +
								'<dd>有效期：' + item.getDate.substr(0, 10) + '~' + item.overdueDate.substr(0, 10) + '</dd>' +
								'<dd>来源:' + item.voucherFrom + '</dd>' +
								'<dd class="coupon_use_btn">' +
								'<a href="invest_home.html">立即使用</a>' +
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
									'<span>已使用</span>' +
									'<dt>' + item.amount + '元抵用券</dt>' +
									'<dd>项目期限:' + item.spans + '</dd>' +
									'<dd>出借金额:起投' + item.limitAmount + '可用</dd>' +
									'<dd>有效期：' + item.getDate.substr(0, 10) + '~' + item.overdueDate.substr(0, 10) + '</dd>' +
									'<dd>来源:' + item.voucherFrom + '</dd>' +
									'<dd class="coupon_use_btn">' +
									'<a href="javascript:;">已使用</a>' +
									'</dd>' +
									'</dl>' +
									'</li>';
							}
						});
					}
					if(couponType == '3') { //已过期
						$.each(json.data.vouchersList, function(index, item) {
							content += '<li class="fl coupon_over">' +
								'<dl>' +
								'<span>已过期</span>' +
								'<dt>' + item.amount + '元抵用券</dt>' +
								'<dd>项目期限:' + item.spans + '</dd>' +
								'<dd>出借金额:起投' + item.limitAmount + '可用</dd>' +
								'<dd>有效期：' + item.getDate.substr(0, 10) + '~' + item.overdueDate.substr(0, 10) + '</dd>' +
								'<dd>来源:' + item.voucherFrom + '</dd>' +
								'<dd class="coupon_use_btn">' +
								'<a href="javascript:;">已过期</a>' +
								'</dd>' +
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
								accountCoupon(couponType, pageNo, pageSize);
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