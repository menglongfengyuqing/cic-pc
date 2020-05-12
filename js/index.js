jQuery.support.cors = true;

/*banner scroll*/
$(function() {

	//滚动公告
	getNotice();
	operationData();
	queryOnlineDateByDays();
	userGuidance();
	getProjectListTJ();
	projectTypeSF(1, 15);
	projectTypeAXT(1, 15);

});

//滚动公告
function getNotice() {
	jQuery.support.cors = true;
	//滚动公告
	$.ajax({
		url: ctxpath + "/cms/getCmsListByType",
		type: 'post',
		dataType: 'json',
		data: {
			pageNo: '1',
			pageSize: '4',
			type: '2',
			from: '1'
		},
		success: function(result) {

			if(result.state == "0") {
				var obj = result.data;
				var list = obj.cmsList;
				var htm = "";
				$.each(list, function(index, value) {
					htm = htm + "<li><a href='information_announcement_sub.html?id=" + value.id + "&type=1'>" + value.title + "</a><span>" + value.createDate + "</span></li>"
				});
				$("#limrq").html(htm);
			} else {
				console.log(result.message);
			}
		}
	});
}
/*-- operation_data--*/
function operationData() {
	$.ajax({
		url: ctxpath + "/cicmorgan/information/disclosure/queryLoanUserInfo",
		type: "post",
		dataType: "json",
		data: {},
		success: function(result) {
			if(result.state == '0') {
				// 累计出借人出借总额.
				$("#investTotalAmount_id").html(result.data.investTotalAmount);
				$("#interestTotalAmount_id").html(result.data.interestTotalAmount);
			} else {
				console.log(result.message);
			}
		}
	});
}

function queryOnlineDateByDays() {
	$.ajax({
		url: ctxpath + "/cicmorgan/information/disclosure/queryOnlineDateByDays",
		type: "post",
		dataType: "json",
		data: {},
		success: function(result) {
			if(result.state == '0') {
				$("#pastDay").html(result.data.pastDays);
			} else {
				console.log(result.message);
			}
		}
	});
}
$(".guide_step_one").children("dl").children("dd").children("span").click(function() {
	window.location.href = "login.html";
})

function userGuidance() {
	if(token != null && token.trim().length > 0) {
		//login_in
		$(".guide_step_one").removeClass("cur");
		$(".guide_step_one").children("dl").children("dd").children("span").html("已注册");
		$(".guide_step_one").children("dl").children("dd").children("span").click(function() {
			window.location.href = "javascript:;";
		});
		$.ajax({
			url: ctxpath + "/activity/userGuidance",
			type: "post",
			dataType: "json",
			data: {
				from: '2',
				token: token,
				type: 1
			},
			success: function(result) {
				if(result.state == 0) {
					var data = result.data;
					if(data.step == 3) {
						$(".guide_step_two").addClass("cur");
						$(".guide_step_two").children("dl").children("dd").children("span").click(function() {
							window.location.href = "account_setting_bankcard.html";
						});

					} else if(data.step == 4) {
						$(".guide_step_two").children("dl").children("dd").children("span").html("已开通");
						$(".guide_step_three").addClass("cur");
						$(".guide_step_three").children("dl").children("dd").children("span").click(function() {
							window.location.href = "account_risk_test.html";
						});
					} else if(data.step == 5) {
						$(".guide_wrap").remove();
					} else if(data.step == 6) {
						$(".guide_wrap").remove();
					} else {
						$(".guide_wrap").remove();
					}
				} else {
					console.log(result.message);
				}

			}

		});
	} else {
		//login_no

	}
}

$('#banner_tabs').flexslider({
	animation: "slide",
	direction: "horizontal",
	easing: "swing",
	slideshowSpeed: 5000,
//	directionNav: false
});
$('#demo01 .flex-prev').click(function() {
    bannerSlider.prev()
});
$('#demo01 .flex-next').click(function() {
    bannerSlider.next()
});

//最新公告滚动代码

var mrqInterval = new Object;
var mrqn;
var limrq = document.getElementById("limrq");
var lml = limrq.getElementsByTagName("li").length;

function liMarquee() {
	limrq.scrollTop++;
	if(limrq.scrollTop % 30 == 0) {
		clearInterval(mrqInterval[0]);
	}
}

function nxtmrq() {
	if(mrqn < lml) {
		mrqInterval[0] = window.setInterval("liMarquee()", 30);
		mrqn++;
	} else {
		limrq.scrollTop = 0;
		mrqn = 0;
		nxtmrq();
	}
}

function intimrq() {
	limrq.scrollTop = 0;
	mrqn = 0;
	mrqInterval[1] = "";
	clearInterval(mrqInterval[1]);
	mrqInterval[1] = window.setInterval("nxtmrq()", 4000);
}
limrq.innerHTML += "<li>" +
	limrq.getElementsByTagName("li")[0].innerHTML + "</li>";
limrq.onmouseover = function() {
	clearInterval(mrqInterval[1]);
}
limrq.onmouseout = function() {
	mrqInterval[1] = window.setInterval("nxtmrq()", 4000);
}
window.onload = intimrq;

/* firefox 兼容性*/
(function($) {
	$.extend($.fx.step, {
		backgroundPosition: function(fx) {
			if(fx.state === 0 && typeof fx.end == 'string') {
				var start = $.curCSS(fx.elem, 'backgroundPosition');
				start = toArray(start);
				fx.start = [start[0], start[2]];
				var end = toArray(fx.end);
				fx.end = [end[0], end[2]];
				fx.unit = [end[1], end[3]];
			}
			var nowPosX = [];
			nowPosX[0] = ((fx.end[0] - fx.start[0]) * fx.pos) + fx.start[0] + fx.unit[0];
			nowPosX[1] = ((fx.end[1] - fx.start[1]) * fx.pos) + fx.start[1] + fx.unit[1];
			fx.elem.style.backgroundPosition = nowPosX[0] + ' ' + nowPosX[1];

			function toArray(strg) {
				strg = strg.replace(/left|top/g, '0px');
				strg = strg.replace(/right|bottom/g, '100%');
				strg = strg.replace(/([0-9\.]+)(\s|\)|$)/g, "$1px$2");
				var res = strg.match(/(-?[0-9\.]+)(px|\%|em|pt)\s(-?[0-9\.]+)(px|\%|em|pt)/);
				return [parseFloat(res[1], 10), res[2], parseFloat(res[3], 10), res[4]];
			}
		}
	});
})(jQuery);
//推荐标
function getProjectListTJ() {
	$.ajax({
		url: ctxpath + "/project/getProjectListWap",
		type: 'post',
		dataType: 'json',
		data: {
			from: '2',
			pageNo: 1,
			pageSize: 10
		},
		success: function(json) {
			if(json.state == 0) {
				var htm = ""; //推荐标
				var numYX = false; //判断是否有供应链  false 没有供应链
				var currentSpan = $(".product_remmend_item");
				var data = json.data;
				var listTJ = data.listTJ;
				var projectNow;
				if(listTJ.length == 0) {
					//没有推荐标
					$(".product_recommended").remove();
				} else {
					$.each(listTJ, function(index, project) {
						if(!numYX) {

							if(project.projectProductType == 2) { //有供应链
								if(project.state == 4 || project.state == 3) {
									projectNow = project;
									numYX = true;
									return false;
								}
							}

						}

					});

					if(!numYX) { //安心投
						$.each(listTJ, function(index, project) {

							if(project.state == 4 || project.state == 3) {
								projectNow = project;
								return false;
							}

						});

					}

					if(projectNow != null) {
						var interestRateIncrease = projectNow.interestRateIncrease; //加息利率
						interestRateIncrease = toFixed2(interestRateIncrease);
						var rate = toFixed2(projectNow.annualRate);
						var ratePI = parseInt(rate);
						var ratePF = rate.toString().split(".")[1];

						if(numYX) {
							htm = '<a href=invest_details.html?id=' + projectNow.id + ' target="_blank">' +
								'<dl class="fl item_name">' +
								'<dt>' + projectNow.name + '(' + projectNow.sn + ')' + '</dt>' +
								'<dd>' + projectNow.label + '</dd>' +
								'</dl>' +
								'<dl class="fl">';

							if(interestRateIncrease == 0) {

								htm += '<dt><b>' + rate + '<i>%</i></b></dt>';
							} else {
								var rateBase = rate - interestRateIncrease;
								rateBase = toFixed2(rateBase);
								var rateBasePI = parseInt(rateBase);
								var rateBasePF = rateBase.toString().split(".")[1];
								htm += '<dt><b>' + rateBasePI + '.' + rateBasePF + '<i>%+' + interestRateIncrease + '%</i></b></dt>';
							}
							htm += '<dd>年化利率</dd>' +
								'</dl>' +
								'<dl class="fl">' +
								'<dt><span>' + projectNow.span + '天</span></dt>' +
								'<dd>借款期限</dd>' +
								'</dl>' +
								'<dl class="fl">' +
								'<dt><span>' + projectNow.minAmount + '元</span></dt>' +
								'<dd>起投金额</dd>' +
								'</dl>';

							if(projectNow.state == 3) {
								htm += '<em class="fr overdue">即将上线</em>' +
									'</a>';
							} else if(projectNow.state == 4 && checkDate(timeStamp2String(), projectNow.loanDate)) {

								htm += '<em class="fr overdue ">已过期</em>' +
									'</a>';
							} else if(projectNow.state == 4) {

								htm += '<em class="fr">立即加入</em>' +
									'</a>';
							}

						} else {
							htm = '<a href=invest_details.html?id=' + projectNow.id + '>' +
								'<dl class="fl item_name">' +
								'<dt>' + projectNow.name + '(' + projectNow.sn + ')' + '</dt>' +
								'<dd>' + projectNow.label + '</dd>' +
								'</dl>' +
								'<dl class="fl">';
							if(interestRateIncrease == 0) {

								htm += '<dt><b>' + rate + '<i>%</i></b></dt>';
							} else {
								var rateBase = rate - interestRateIncrease;
								rateBase = toFixed2(rateBase);
								var rateBasePI = parseInt(rateBase);
								var rateBasePF = rateBase.toString().split(".")[1];
								htm += '<dt><b>' + rateBasePI + '.' + rateBasePF + '<i>%+' + interestRateIncrease + '%</i></b></dt>';
							}

							htm += '<dd>年化利率</dd>' +
								'</dl>' +
								'<dl class="fl">' +
								'<dt><span>' + projectNow.span + '天</span></dt>' +
								'<dd>借款期限</dd>' +
								'</dl>' +
								'<dl class="fl">' +
								'<dt><span>' + projectNow.minAmount + '元</span></dt>' +
								'<dd>起投金额</dd>' +
								'</dl>';

							if(projectNow.state == 3) {
								htm += '<em class="fr overdue">即将上线</em>' +
									'</a>';
							} else if(projectNow.state == 4 && checkDate(timeStamp2String(), projectNow.loanDate)) {

								htm += '<em class="fr overdue">已过期</em>' +
									'</a>';
							} else if(projectNow.state == 4) {

								htm += '<em class="fr">立即加入</em>' +
									'</a>';
							}

						}

					}

					currentSpan.html(htm);
					var progressbarWidth = $('.product_remmend_item .progress').width();
					var coefficient = progressbarWidth / 100;
					$('.product_remmend_item .progress').each(function() {
						var t = $(this),
							dataperc = t.attr('data-percent'),
							dataperc = parseInt(dataperc);
						barperc = Math.round(dataperc * coefficient);
						t.find('.inner').animate({
							width: barperc
						}, dataperc * 50 + "%");

					});
				}

			}
		}
	});
}
//供应链产品
function projectTypeSF(pageNo, pageSize) {

	$.ajax({
		url: ctxpath + "/project/getProjectListWap",
		type: "post",
		dataType: "json",
		data: {

			from: '1',
			pageNo: pageNo,
			pageSize: pageSize,
			projectProductType: 2
		},
		success: function(json) {

			if(json.state == "0") {
				var data = json.data;
				var listZC = data.listZC;
				var str = "";

				//普通标
				for(var i = 0; i < 4 && listZC.length > 1 ; i++) {
					
					var project = listZC[i];
					var currentAmount = parseFloat(project.currentAmount);
					var amount = parseFloat(project.amount);
					var percentage = currentAmount / amount * 100;

					if(currentAmount == amount) {
						percentage = 100;
					} else if(percentage >= 99.5) {

						percentage = 99;
					} else if(percentage < 0.5 && percentage > 0) {
						percentage = 1;
					} else {
						percentage = Math.round(percentage);
					}
					var interestRateIncrease = project.interestRateIncrease; //加息利率
					interestRateIncrease = toFixed2(interestRateIncrease);
					var rate = toFixed2(project.annualRate);
					var ratePI = parseInt(rate);
					var ratePF = rate.toString().split(".")[1];

					str += '<li class="fl moseenter_shadow" onclick="jsUrl(\'' + project.id + '\'); _czc.push([\'_trackEvent\', \'首页供应链\', \'点击\', \'列表模块\']);">' +

						'<h5>' + project.name + '(' + project.sn + ')' + '</h5>' +
						'<h6><span>' + project.minAmount + '元起投</span></h6>' +
						'<dl>';
					if(interestRateIncrease == 0) {

						str += '<dt><b>' + rate + '<i>%</i></b></dt>';
					} else {
						var rateBase = rate - interestRateIncrease;
						rateBase = toFixed2(rateBase);
						var rateBasePI = parseInt(rateBase);
						var rateBasePF = rateBase.toString().split(".")[1];
						str += '<dt><b>' + rateBasePI + '.' + rateBasePF + '<i>%+' + interestRateIncrease + '%</i></b></dt>';
					}

					str += '<dd>年化利率</dd>' +
						'</dl>' +
						'<div class="clear progress_safe">';
					if(project.state == 3) {
						str += '<div class="progress fr" data-percent="' + 0 + '%">' +
							'<div class="outer"><span class="inner"></span></div>' +
							'<div class=" fl percentage_text"><b>借款期限:' + project.span + '天</b><span><em>' + toFixed2(project.currentAmount / 10000) + '万/' + toFixed2(project.amount / 10000) + '万</em></span></div>' +
							'</div>' +
							'</div>' +
							'<div class="product_scf_btn clear">' +
							'<a href="invest_details.html?id=' + project.id + '" >即将上线</a>' +
							'</div>' +

							'</li>';
					} else if(project.state == 4 && checkDate(new Date().format("yyyyMMddhhmmss"), project.loanDate)) {
						str += '<div class="progress fr" data-percent="' + percentage + '%">' +
							'<div class="outer"><span class="inner" ></span></div>' +
							'<div class=" fl percentage_text"><b>借款期限:' + project.span + '天</b><span><em>' + toFixed2(project.currentAmount / 10000) + '万/' + toFixed2(project.amount / 10000) + '万</em></span></div>' +
							'</div>' +
							'</div>' +
							'<div class="product_scf_btn clear">' +
							'<a href="invest_details.html?id=' + project.id + '" class="default">已过期</a>' +
							'</div>' +

							'</li>';
					} else if(project.state == 4) {
						str += '<div class="progress fr" data-percent="' + percentage + '%">' +
							'<div class="outer"><span class="inner"></span></div>' +
							'<div class=" fl percentage_text"><b>借款期限:' + project.span + '天</b><span><em>' + toFixed2(project.currentAmount / 10000) + '万/' + toFixed2(project.amount / 10000) + '万</em></span></div>' +
							'</div>' +
							'</div>' +
							'<div class="product_scf_btn clear">' +
							'<a href="invest_details.html?id=' + project.id + '" >立即加入</a>' +
							'</div>' +
							'</a>' +
							'</li>';
					} else if(project.state == 5 || project.state == 6) {
						str += '<div class="progress fr" data-percent="' + 100 + '%">' +
							'<div class="outer"><span class="inner" ></span></div>' +
							'<div class=" fl percentage_text"><b>借款期限:' + project.span + '天</b><span><em>' + toFixed2(project.currentAmount / 10000) + '万/' + toFixed2(project.amount / 10000) + '万</em></span></div>' +
							'</div>' +
							'</div>' +
							'<div class="product_scf_btn clear">' +
							'<a href="invest_details.html?id=' + project.id + '" class="default">还款中</a>' +
							'</div>' +

							'</li>';
					} else if(project.state == 7) {
						str += '<div class="progress fr" data-percent="' + 100 + '%">' +
							'<div class="outer"><span class="inner"></span></div>' +
							'<div class=" fl percentage_text"><b>借款期限:' + project.span + '天</b><span><em>' + toFixed2(project.currentAmount / 10000) + '万/' + toFixed2(project.amount / 10000) + '万</em></span></div>' +
							'</div>' +
							'</div>' +
							'<div class="product_scf_btn clear">' +
							'<a href="invest_details.html?id=' + project.id + '" class="default">已还款</a>' +
							'</div>' +

							'</li>';
					}
				}

				$(".product_scf_item").html(str);

				var progressbarWidth = $('.product_scf_item .progress').width();
				var coefficient = progressbarWidth / 100;
				$('.product_scf_item .progress').each(function() {
					var t = $(this),
						dataperc = t.attr('data-percent'),
						dataperc = parseInt(dataperc);
					barperc = Math.round(dataperc * coefficient);
					t.find('.inner').animate({
						width: barperc
					}, dataperc * 50 + "%");

				});
				$(".product_scf_item li").eq(-1).addClass("no_mr");

			} else {
				$(".product_scf").remove();
			}
		}
	});
}

function jsUrl(id) {
	window.open("invest_details.html?id=" + id);
}
//安心投产品
function projectTypeAXT(pageNo, pageSize) {

	$.ajax({
		url: ctxpath + "/project/getProjectListWap",
		type: "post",
		dataType: "json",
		data: {

			from: '1',
			pageNo: pageNo,
			pageSize: pageSize,
			projectProductType: 1
		},
		success: function(json) {

			if(json.state == "0") {
				var data = json.data;
				var listZC = data.listZC;
				var str = "";

				//普通标
				for(var i = 0; i < 2 && listZC.length > 0 ; i++) {
					var project = listZC[i];
					var currentAmount = parseFloat(project.currentAmount);
					var amount = parseFloat(project.amount);
					var percentage = currentAmount / amount * 100;

					var balanceamount = amount - currentAmount;
					balanceamount = toFixed2(balanceamount / 10000);
					if(currentAmount == amount) {
						percentage = 100;
					} else if(percentage >= 99.5) {

						percentage = 99;
					} else if(percentage < 0.5 && percentage > 0) {
						percentage = 1;
					} else {
						percentage = Math.round(percentage);
					}
					var interestRateIncrease = project.interestRateIncrease; //加息利率
					interestRateIncrease = toFixed2(interestRateIncrease);
					var rate = toFixed2(project.annualRate);
					var ratePI = parseInt(rate);
					var ratePF = rate.toString().split(".")[1];

					str += '<div class="product_axt_item moseenter_shadow ">' +
						'<a href="invest_details.html?id=' + project.id + '" target="_blank"  onclick="_czc.push([\'_trackEvent\', \'首页安心投\', \'点击\', \'列表模块\'])">' +
						'<h5>' + project.name + '<span>' + project.minAmount + '元起投</span></h5>' +
						'<dl class="fl">';

					if(interestRateIncrease == 0) {

						str += '<dt><b>' + rate + '<i>%</i></b></dt>';
					} else {
						var rateBase = rate - interestRateIncrease;
						rateBase = toFixed2(rateBase);
						var rateBasePI = parseInt(rateBase);
						var rateBasePF = rateBase.toString().split(".")[1];
						str += '<dt><b>' + rateBasePI + '.' + rateBasePF + '<i>%+' + interestRateIncrease + '%</i></b></dt>';
					}

					str += '<dd>年化利率</dd>' +
						'</dl>' +
						'<dl class="fl">' +
						'<dt><span>' + project.span + '天</span></dt>' +
						'<dd>借款期限</dd>' +
						'</dl>' +
						'<dl class="fl">' +
						'<dt><span>' + balanceamount + '万</span></dt>' +
						'<dd>剩余金额</dd>' +
						'</dl>';

					if(project.state == 3) {

						str += '<em class="fr">即将上线</em>' +
							'<div class="clear progress_safe">' +
							'<div class="progress fr" data-percent="' + 0 + '%">' +
							'<div class="outer"><span class="inner"></span></div>' +
							'</div>' +
							'</div>' +
							'</a>' +
							'</div>';

					} else if(project.state == 4 && checkDate(new Date().format("yyyyMMddhhmmss"), project.loanDate)) {

						str += '<em class="fr default">已过期</em>' +
							'<div class="clear progress_safe">' +
							'<div class="progress fr" data-percent="' + percentage + '%">' +
							'<div class="outer"><span class="inner"></span></div>' +
							'</div>' +
							'</div>' +
							'</a>' +
							'</div>';
					} else if(project.state == 4) {
						str += '<em class="fr">立即加入</em>' +
							'<div class="clear progress_safe">' +
							'<div class="progress fr" data-percent="' + percentage + '%">' +
							'<div class="outer"><span class="inner" ></span></div>' +
							'</div>' +
							'</div>' +
							'</a>' +
							'</div>';
					} else if(project.state == 5 || project.state == 6) {

						str += '<em class="fr default">还款中</em>' +
							'<div class="clear progress_safe">' +
							'<div class="progress fr" data-percent="' + 100 + '%">' +
							'<div class="outer"><span class="inner"></span></div>' +
							'</div>' +
							'</div>' +
							'</a>' +
							'</div>';
					} else if(project.state == 7) {

						str += '<em class="fr default">已还款</em>' +
							'<div class="clear progress_safe">' +
							'<div class="progress fr" data-percent="' + 100 + '%">' +
							'<div class="outer"><span class="inner" ></span></div>' +
							'</div>' +
							'</div>' +
							'</a>' +
							'</div>';
					}
				}

				$(".product_axt_wrap").html(str);
				var progressbarWidth = $('.product_axt_wrap .progress').width();
				var coefficient = progressbarWidth / 100;
				$('.product_axt_wrap .progress').each(function() {
					var t = $(this),
						dataperc = t.attr('data-percent'),
						dataperc = parseInt(dataperc);
					barperc = Math.round(dataperc * coefficient);
					t.find('.inner').animate({
						width: barperc
					}, dataperc * 50 + "%");

				});

			} else {
				$(".product_axt").remove();
			}
		}
	});
}

function toDecimal2(x) {
	var f = parseFloat(x);
	if(isNaN(f)) {
		return false;
	}
	var f = Math.round(x * 100) / 100;
	var s = f.toString();
	var rs = s.indexOf('.');
	if(rs < 0) {
		rs = s.length;
		s += '.';
	}
	while(s.length <= rs + 2) {
		s += '0';
	}
	return s;
}

function toFixed2(num) {
	num = toDecimal2(num);
	num = num.toString();
	num = num.substring(0, num.lastIndexOf('.') + 3);
	return num;
}