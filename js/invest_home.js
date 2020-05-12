$(function() {

	// 项目类型选择. 
	$("#pro_type li").click(function(event) {
		$(this).addClass('cur').siblings().removeClass('cur');

	});
	// --
	investment_project_list(1, 8);
});

/**
 * 描述: 出借项目列表. <br>
 */
function investment_project_list(pageNo, pageSize, projecttype) {

	// 出借项目列表.
	var $_investment_project_list_li = $("#investment_project_list");
	// 每次请求之前删除之前页面的缓存内容.
	$_investment_project_list_li.empty();

	// 调用接口.
	$.ajax({
		url: ctxpath + "/project/getProjectList",
		type: 'post',
		dataType: 'json',
		data: {
			from: '1',
			pageNo: pageNo,
			pageSize: pageSize,
			projectProductType: projecttype,

		},
		success: function(json) {
			// 标的描述.
			var content = '';
			if(json.data.length > 0) {

				$.each(json.data, function(index, item) {
					var currentamount = parseFloat(item.currentamount);
					var amount = parseFloat(item.amount);
					var percentage = currentamount / amount * 100;
					if(currentamount == amount) {
						percentage = 100;
					} else if(percentage >= 99.5) {
						percentage = 99;
					} else if(percentage < 0.5 && percentage > 0) {
						percentage = 1;
					} else {
						percentage = Math.round(percentage);
					}
					var interestRateIncrease = item.interestRateIncrease; //加息利率
					interestRateIncrease = toFixed2(interestRateIncrease);
					var rate = toFixed2(item.rate);
					var ratePI = parseInt(rate);
					var ratePF = rate.toString().split(".")[1];

					content += '<div class="item_group" onclick="jsUrl(\'' + item.projectid + '\');">' +
						'<div class="item_group_con">' +
						'<h4><b>' + item.name + '(' + item.sn + ')</b><span>' + item.label + '</span></h4>' +
						'<div class="item_msg">' +
						'<dl class="fl rate">';

					

						if(interestRateIncrease == 0) {
						content +=	'<dt>' + rate + '<span>%</span></dt>' ;

						} else {
							var rateBase = rate - interestRateIncrease;
							rateBase = toFixed2(rateBase);
							var rateBasePI = parseInt(rateBase);
							var rateBasePF = rateBase.toString().split(".")[1];
							content +=	'<dt>' + rateBasePI+ '.' + rateBasePF+'<span>%+' + interestRateIncrease+'%</span></dt>' ;
						}
					content += '<dd>年化利率</dd>' +
						'</dl>' +
						'<dl class="fl date">' +
						'<dt>' + item.span + '天</dt>' +
						'<dd>借款期限</dd>' +
						'</dl>' +
						'<dl class="fl step_amount">' +
						'<dt>' + item.minAmount + '元</dt>' +
						'<dd>起投金额</dd>' +
						'</dl>' +
						'<div class=" progress_safe fl">' +
						'<div class="progress fl" data-percent="' + item.percentage + '">' +
						'<div class="outer"><span class="inner" ></span></div>' +
						'</div>' +
						'<b>' + percentage + '%</b>' +
						'</div>' +
						'<div class="fl">';

					if(item.prostate == 3) {
						content += '<a href="invest_details.html?id=' + item.projectid + '" onclick=\"_czc.push([\'_trackEvent\', \'出借列表条目\', \'点击\', \'按钮\'])\">即将上线</a>';

					}
					if(item.prostate == 4) {
						if(checkDate(new Date().format("yyyyMMddhhmmss"), item.loandate)) {
							content += '<a href="invest_details.html?id=' + item.projectid + '" class="default" onclick=\"_czc.push([\'_trackEvent\', \'出借列表条目\', \'点击\', \'按钮\'])\">已过期</a>';
						} else {
							content += '<a href="invest_details.html?id=' + item.projectid + '" onclick=\"_czc.push([\'_trackEvent\', \'出借列表条目\', \'点击\', \'按钮\'])\">立即出借</a>';
						}
					}
					if(item.prostate == 5) {
						content += '<a href="invest_details.html?id=' + item.projectid + '"  class="default" onclick=\"_czc.push([\'_trackEvent\', \'出借列表条目\', \'点击\', \'按钮\'])\">还款中</a>';
					}
					if(item.prostate == 6) {
						content += '<a href="invest_details.html?id=' + item.projectid + '"  class="default" onclick=\"_czc.push([\'_trackEvent\', \'出借列表条目\', \'点击\', \'按钮\'])\">还款中</a>';
					}
					if(item.prostate == 7) {
						content += '<a href="invest_details.html?id=' + item.projectid + '"  class="default" onclick=\"_czc.push([\'_trackEvent\', \'出借列表条目\', \'点击\', \'按钮\'])\">已还款</a>';
					}

					content += '</div>' +
						'</div>' +
						'</div>' +
						'</div>';

				});

				$_investment_project_list_li.html(content);
				var progressbarWidth = $('#investment_project_list .progress').width();
				var coefficient = progressbarWidth / 100;
				$('#investment_project_list .progress').each(function() {
					var t = $(this),
						dataperc = t.attr('data-percent'),
						dataperc = parseInt(dataperc);
					barperc = Math.round(dataperc * coefficient);
					t.find('.inner').animate({
						width: barperc
					}, dataperc * 50 + "%");

				});
				//分页
				if(json.pageCount > 1) {
					$('#light-pagination').show();
					$('#light-pagination').pagination({
						pages: json.pageCount,
						currentPage: json.pageNo, //当前页
						onPageClick: function(pageNo) {
							investment_project_list(pageNo, pageSize, projecttype);
							_czc.push(['_trackEvent', '出借列表页码', '点击', '页码']);
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
				$_investment_project_list_li.append(content);
				var progressbarWidth = $('#investment_project_list .progress').width();
				var coefficient = progressbarWidth / 100;
				$('#investment_project_list .progress').each(function() {
					var t = $(this),
						dataperc = t.attr('data-percent'),
						dataperc = parseInt(dataperc);
					barperc = Math.round(dataperc * coefficient);
					t.find('.inner').animate({
						width: barperc
					}, dataperc * 50 + "%");

				});
				$('#light-pagination').hide();
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

function jsUrl(id) {
	window.location.href = "invest_details.html?id=" + id;
}