var projectId = getArgumentsByName("id");
var amount = getArgumentsByName("amount");
var pageNo = parseInt(1);
var pageSize = parseInt(5);
var vouid = new Array();
var vouchers = "";
var vouidT;
var vouidT2;
var vouAmount; //代金券
var availableAmount; //用户可用金额
var bindBank;
var isTest;
var userInfo;
var isCanUseCoupon;
var awardsLength = 0;
var balanceAmount; //项目剩余金额
var minAmount; //项目起投金额
var allInvestAmount; //全投金额
var awardsId = "";
var overDateTime2;
var selectedLength = 0; //抵用券选中数量
var selectedAmount = 0; //抵用券选中金额
var selectedLengthT; //推荐抵用券数量
var selectedAmountT; //推荐抵用券金额

/*项目详情*/
$(function() {

	//初始化
	$.ajax({
		url: ctxpath + "/user/getUserInfo",
		type: "post",
		dataType: "json",
		data: {
			from: '2',
			token: token
		},
		success: function(result) {
			if(result.state == '0') {
				userInfo = result.data;
				isTest = userInfo.isTest
			}
		}
	});

	//项目介绍
	getProjectInfo();

	//获取账户余额
	$.ajax({
		url: ctxpath + "/user/getcgbUserAccount ",
		type: 'post',
		dataType: 'json',
		data: {
			from: '2',
			token: token
		},
		success: function(json) {
			if(json.state == 0) {
				availableAmount = json.data.availableAmount;
				$("#availableAmount").html(formatCurrency(availableAmount) + "元");
			} else {}
		}
	});

});

//获取项目信息
function getProjectInfo() {

	if(projectId != null && projectId.trim().length > 0) {
		$.ajax({
			url: ctxpath + "/project/getProjectInfo",
			type: 'post',
			dataType: 'json',
			data: {
				from: '2',
				projectid: projectId
			},
			success: function(json) {
				// 查找成功.
				if(json.state == 0) {
					var data = json.data;
					var isNewType = data.isNewType;
					var projectProductType=data.projectProductType;
					if(projectProductType == 2) {//供应链
						$("#agreementFile").attr("href", "doc/scf.pdf");
					}
					else if(projectProductType == 1){
						$("#agreementFile").attr("href", "doc/axt.pdf");
					}
					$("#pro_name").html(data.name); //出借项目
					$("#pro_rate").html(data.rate + "%"); // 预期出借利率
					$("#pro_span").html(data.span + "天"); // 项目期限
					$("#end_date").html(data.endDate); // 还款日期
					$("#amount").html(amount + "元"); // 出借金额
					$("#payAmount").html(amount + "元"); // 购买金额

					// 项目id.
					$("#temp_project_id").val(projectId);
					// 项目起投金额.
					$("#temp_pro_min_amount").val(data.minamount);
					// 是否使用抵用券.
					$("#temp_isCanUseCoupon").val(data.isCanUseCoupon);

					// 是否使用加息券.
					$("#temp_isCanUsePlusCoupon").val(data.isCanUsePlusCoupon);
					// 项目满标日期.
					$("#temp_countdowndate").val(data.countdowndate);
					// 项目名称.
					$("#temp_pro_name").val(data.name);
					// 项目年化利率.
					$("#temp_pro_rate").val(data.rate + "%");
					// 项目期限.
					$("#temp_pro_span").val(data.span);
					// 放款日期.
					$("#temp_loan_date").val(data.loandate);
					// 购买金额.
					// 投资日期距离放款日期之间的天数.
					var days = calcDays(data.loandate);
					$("#temp_days").val(days);
					// 预期利息
					var investEarnings = (parseFloat(amount) * parseFloat(data.rate)) / (parseFloat(365) * parseFloat(100));
					investEarnings = formatCurrency(investEarnings) * parseFloat(data.span);
					investEarnings = formatCurrency(investEarnings);
					//					var investEarnings = (parseFloat(amount) * parseFloat(data.rate) * (parseFloat(days) + parseFloat(data.span)) / (parseFloat(365) * parseFloat(100))).toFixed(2);
					// 预期利息【temp】.
					$("#temp_invest_earnings").val(investEarnings);
					$("#invest_earnings").html(investEarnings + "元");
					//获取优惠券
					myCouponList(amount);
				}
			}
		});
	}

}

/**
 * 显示用户出借金额可用抵用券列表
 * @param {Object} amount
 */
function myCouponList(amount) {
	isCUCoupon = $("#temp_isCanUseCoupon").val();
	if(isCUCoupon == 0) {
		$.ajax({
			url: ctxpath + "/activity/getUserAwardsHistoryList",
			type: 'post',
			dataType: 'json',
			data: {
				from: '2',
				token: token,
				state: '1',
				projectId: projectId
			},
			success: function(json) {
				// --
				var sltContainer = $("#couponsList");

				if(json.state == 4) {
					// console.log("系统超时！");
					logout();
					return;
				}

				// 优惠券奖励列表响应成功了.
				if(json.state == 0) {

					vouid.splice(0, vouid.length);
					vouidT = new Array();
					vouidT2 = new Array();
					var awards = json.data.awardsList;
					if(awards != null && awards.length > 0) {
						selectedLength = 0;
						selectedAmount = 0;
						awardsLength = awards.length;
						var couponLength = 0;
						awardsAmount = Math.floor(amount / 1000) * 10; //抵用券金额
						awardsAmountMax = awardsAmount;
						$.each(awards, function(index, item) {
							var limit_amount = item.limitAmount;
							var overDateTime = item.overdueDate;
							var nowDateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
							if(amount >= limit_amount && compareTo(nowDateTime, overDateTime)) {
								var value = item.value;
								if(awardsAmount >= value) {
									//选中当前优惠券
									awardsAmount -= value;
									selectedLength++;
									selectedAmount += value;
									vouid.push(item.id);
									// console.log(vouid);
									if(awardsAmount < 10) {
										return true;
									}
								}
							}
						});
						if(vouid.length > 0) {
							$.each(vouid, function(index, item) {
								vouidT.push(item);
								vouidT2.push(item);
							});
						} else {

						}

						awardsAmountMaxOn = awardsAmountMax - awardsAmount;
						selectedLengthT = selectedLength;
						selectedAmountT = selectedAmount;

						if(selectedLength == 0) {
							$("#awardsValue").html('<b>无可用优惠券</b>').addClass("default");
							$(".coupon_list_wrap").addClass("default");
						} else {
							$("#awardsValue").html('<b>已选择' + selectedLength + '张（最优方案）</b><i> 抵扣' + selectedAmount + '元&nbsp;></i>');
						}

					} else {

						$("#coupons").hide();

					}
				} else {
					// console.log("读取优惠券失败");
				}
			}

		});
	} else {
		// console.log("优惠券不可用");
		$("#coupons").hide();
	}
}

$("#awardsValue").click(function() {

	$(this).addClass("check");
	if(awardsLength == '0') {
		getMsg("没有符合当前金额的优惠券")
	} else {
		//渲染优惠券列表
		addVouids();

	}
	_czc.push(['_trackEvent', '确认出借', '点击', '优惠券下拉']);

})

//渲染优惠券列表
function addVouids() {
	$.ajax({
		url: ctxpath + "/activity/getUserAwardsHistoryList",
		type: 'post',
		dataType: 'json',
		data: {
			from: '1',
			token: token,
			state: '1',
			projectId: projectId
		},
		success: function(json) {
			if(json.state == 4) {
				// console.log("系统超时！");
				logout();
				return;
			}
			if(json.state == 0) {
				$(".coupon_list").show();

				$("#awardsRecommend").html("");
				$("#awardsNormal").html("");
				var awards = json.data.awardsList;
				if(awards != null && awards.length > 0) {
					var str = '<ul>';
					var str2 = '<ul>';
					$.each(awards, function(index, item) {

						if(vouid != null && vouid.length > 0) {
							$.each(vouid, function(index2, item2) {

								if(item.id == item2) {

									str += '<li class="cur" onclick="saveAwardsId(' + index + ',' + item.value + ',' + item.type + ')">' + item.value + '元现金券 <b></b>' +
										'<input type="hidden" id = "' + index + '" value="' + item.id + '">' +
										'<input type="hidden" id = "a' + index + '" value="' + item.overdueDate + '">' +
										'<input type="hidden" id = "b' + index + '" value="' + item.value + '">' +
										'</li>';

									return false;

								} else if(parseFloat(amount) >= parseFloat(item.limitAmount)) {
									str2 += '<li class="" onclick="saveAwardsId(' + index + ',' + item.value + ',' + item.type + ')">' + item.value + '元现金券 <b></b>' +
										'<input type="hidden" id = "' + index + '" value="' + item.id + '">' +
										'<input type="hidden" id = "a' + index + '" value="' + item.overdueDate + '">' +
										'<input type="hidden" id = "b' + index + '" value="' + item.value + '">' +
										'</li>';
								}
							});

							//										return false;
						} else if(amount >= item.limitAmount) {
							//							$("#vouidOk").hide();
							str2 += '<li class="" onclick="saveAwardsId(' + index + ',' + item.value + ',' + item.type + ')">' + item.value + '元现金券 <b></b>' +
								'<input type="hidden" id = "' + index + '" value="' + item.id + '">' +
								'<input type="hidden" id = "a' + index + '" value="' + item.overdueDate + '">' +
								'<input type="hidden" id = "b' + index + '" value="' + item.value + '">' +
								'</li>';
							//							str2 += '<li class="" onclick="saveAwardsId(' + index + ',' + item.value + ',' + item.type + ')">' + item.value + '元现金券 <b></b>' +
							//								'<input type="hidden" id = "' + index + '" value="' + item.id + '">' +
							//								'<input type="hidden" id = "a' + index + '" value="' + item.overdueDate + '">' +
							//								'<input type="hidden" id = "b' + index + '" value="' + item.value + '">' +
							//								'</li>';
						}

					});
					str += '</ul>';
					str2 += '</ul>';
					$("#awardsRecommend").html(str);
					$("#awardsNormal").html(str2);
				}
			}
		}
	});
}
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if(index > -1) {
		this.splice(index, 1);
	}
};
//保存使用的优惠券
function saveAwardsId(index, awardsValue, type) {
	//	$(".counpon_not_enough").hide();
	awardsId = $("#" + index + "").val();
	overDateTime2 = $("#a" + index + "").val();
	overDateTime2 = overDateTime2.substring(0, 10);
	if($("#" + index + "").parent().hasClass("cur")) {
		$("#" + index + "").parent().removeClass("cur");
		selectedAmount -= awardsValue;
		selectedLength--;
		vouid.remove(awardsId);
	} else {
		var awardsAmount2 = selectedAmount + awardsValue;
		if(awardsAmount2 > awardsAmountMax) {
			$(".counpon_not_enough h4").html("抵扣金额最多不超过" + awardsAmountMax + "元")
			$(".counpon_not_enough").show();
			setTimeout(closeEro, 2000);
			return;
		} else {
			selectedAmount += awardsValue;
		}
		$("#" + index + "").parent().addClass("cur");
		selectedLength++;
		vouid.push(awardsId);
	}

}

//选中优惠券
$("#backCoupon").click(function() {
	if(vouidT == vouidT2) {
		$("#awardsValue").html('<b>已选择' + selectedLengthT + '张（最优方案）</b><i> 抵扣' + selectedAmountT + '元&nbsp;></i>');

	} else {
		$("#awardsValue").html('<b>已选择' + selectedLengthT + '张</b><i> 抵扣' + selectedAmountT + '元&nbsp;></i>');
	}
	vouid = vouidT;

	closeWindow();
});

$("#vouidOk").click(function() {

	vouidT = vouid;
	selectedLengthT = selectedLength;
	selectedAmountT = selectedAmount;
	$("#awardsValue").html('<b>已选择' + selectedLength + '张</b><i> 抵扣' + selectedAmount + '元&nbsp;></i>');
	closeWindow();
	$("#awardsValue").removeClass("check");
	_czc.push(['_trackEvent', '确认出借', '点击', '选择优惠券']);

});
//关闭弹窗
function closeWindow() {
	$(".coupon_list").hide();
}
//关闭错误提示
function closeEro() {
	$(".counpon_not_enough").hide();
}

/**
 * 描述: 当选择不同类型的优惠券，改变相应元素的值. <br>
 */
function couponsOnchange(vouid) {
	//console.log("vouid=" + vouid);
	$.ajax({
		url: ctxpath + "/verify/couponsOnchange",
		type: 'post',
		dataType: 'json',
		data: {
			from: '1',
			vouid: vouid
		},
		success: function(json) {
			// 接口调用成功.
			if(json.state == 0) {
				if(json.data == null) {
					// 变更实际需支付金额.
					vouAmount = "";
				} else {
					// 抵用券业务处理.
					if(json.data.type == 1) {
						// 实际需支付金额.
						var payAmount = parseFloat(amount) - parseFloat(json.data.value);
						vouAmount = json.data.value;
						// 变更实际需支付金额.
						$("#payAmount").html(payAmount + "元");
					}
				}
			}
		}
	});
}

/**
 * 描述: 投资. <br>
 */

$("#confirm_the_investment").click(function() {
	_czc.push(['_trackEvent', '确认出借', '点击', '确定按钮']);
	var nowTime = new Date().getTime();
	var clickTime = $(this).attr("ctime");
	clickTime = parseInt(clickTime);
	if(clickTime != 'undefined' && (nowTime - clickTime < 1000)) {
		return false;
	} else {
		$(this).attr("ctime", nowTime);
		invest();
	}

})

function invest() {
	$(".error_msg").hide();
	// token失效.
	if(token == null) {
		//		loginWindow();
		logout();
		return;
	}
	// 同意中投摩根用户服务协议.
	if($("#agreement").prop("checked") != true) {

		getMsg("请您勾选用户服务协议！");
		return false;
	}
	var projectName = $("#temp_pro_name").val();

	vouchers = "";
	for(var i = 0; i < vouid.length; i++) {
		if(i == vouid.length - 1) {
			vouchers += vouid[i];
		} else {
			vouchers += vouid[i] + ",";
		}

	}

	// 懒猫用户预处理-出借 
	$.ajax({
		url: ctxpath + "/lanMaoTenderPre/userTender",
		type: 'post',
		dataType: 'json',
		async: false,
		data: {
			from: '1',
			token: token,
			amount: amount,
			vouchers: vouchers,
			projectId: projectId
		},
		success: function(json) {
			if(json.state == "0") {
				$(".mask_msg_pay").show();
				$(".mask_drop").show();
				// 出借预处理数据封装成功
				openPostWindow(json.data);
			} else if(json.state == "3") {
				$(".error_msg").html(json.message).show();
			}
		}
	});

}

/**
 * 描述: 计算出借日期与放款日期之间的天数. <br>
 */
function calcDateDiff(currentDate, loanDate) {
	var type1 = typeof currentDate,
		type2 = typeof loanDate;
	if(type1 == 'string')
		currentDate = stringToTime(currentDate);
	else if(currentDate.getTime)
		currentDate = currentDate.getTime();
	if(type2 == 'string')
		loanDate = stringToTime(loanDate);
	else if(loanDate.getTime)
		loanDate = loanDate.getTime();
	if(currentDate > loanDate) {
		return 0;
	}
	return(loanDate - currentDate) / (1000 * 60 * 60 * 24); // 结果是秒
}

/**
 * 描述: 当前系统日期字符串. <br>
 */
function nowDate() {
	var nowDate = new Date();
	// 日.
	var day = nowDate.getDate();
	// 月(0-11，0代表1月份).
	var month = nowDate.getMonth();
	//年(完整的年份4位).
	var year = nowDate.getFullYear();
	return year + '-' + (month + 1) + '-' + day;
}

/**
 * 描述: 出借日期距离放款日期的天数. <br>
 */
function calcDays() {
	// 放款日期.
	var loanDate = $("#temp_loan_date").val();
	// 当前系统日期.
	var currentDate = nowDate();
	// 出借日期距离放款日期的天数.
	var days = calcDateDiff(currentDate, loanDate);

	return days;
}

/**
 * 描述: 日期字符串转换成Time. <br>
 */
function stringToTime(str) {
	var f = str.split(' ', 2);
	var d = (f[0] ? f[0] : '').split('-', 3);
	var t = (f[1] ? f[1] : '').split(':', 3);
	return(new Date(parseInt(d[0], 10) || null, (parseInt(d[1], 10) || 1) - 1, parseInt(d[2], 10) || null, parseInt(t[0], 10) || null, parseInt(t[1], 10) || null, parseInt(t[2], 10) || null)).getTime();
}

//错误提示
function getMsg(str) {

	$(".error_msg").show().html(str);
}

$(".close_mask").click(function() {
	$(".mask_drop,.mask_fixed_wrap").hide();
});
var flagCheck = false;
/*复选框切换*/
$(".agreement b").click(function() {

	$(this).toggleClass("cur");
	if($(this).hasClass('cur')) {
	_czc.push(['_trackEvent', '确认出借', '点击', '勾选协议']);
		
		$("#agreement").attr("checked", true);

	} else {
		$("#agreement").attr("checked", false);

	}

});