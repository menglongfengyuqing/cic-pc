jQuery.support.cors = true;

$(function() {
	// 年.
	var year = getArgumentsByName("year");
	// console.log(year);
	// 月.
	var month = getArgumentsByName("month");
	var monthNew = month; 
	if (month < 10) {
		monthNew = "0" + month;
	}
	// console.log(month);
	// 标题.
	$("#disclosureDataMonthTitle").html(monthNew + "月份运营报告");
	// 指定年月的时间.
	var day = new Date(year, month, 0);
	// console.log(day);
	// 获取当前月天数.
	var days = day.getDate();
	// console.log(days);
	// 开始时间
	var startTime = year + "-" + monthNew + "-" + "01";
	// console.log(startTime);
	// 结束时间.
	var endTime = year + "-" + monthNew + "-" + days;
	// console.log(endTime);
	// 月份时间区间.
	$("#disclosureDataMonthDate").html(startTime + "~" + endTime);
	if (month >= 1 && month <= 12) {
		// 本月数据概况.
		thisMonthDataInfo(startTime, endTime);
	}
	// 平台数据概况
	platformDataOverview(startTime, endTime);
	// 出借人概况
	investPeopleDataOverview(startTime, endTime);
});

/**
 * 出借人概况.
 */
function investPeopleDataOverview(startTime, endTime) {

	// 性别占比
	// 男
	var A = 0;
	// 女
	var B = 0;
	// 25岁占比.
	var O = 0;
	// 26-30岁占比.
	var P = 0;
	// 31-35岁占比.
	var Q = 0;
	// 36-40岁占比.
	var R = 0;
	// 41-45岁占比.
	var S = 0;
	// 46-50岁占比.
	var T = 0;
	// 51岁及以上占比.
	var U = 0;

	$.ajax({
		url : ctxpath + "/cicmorgan/information/disclosure/investPeopleDataOverview",
		type : "post",
		dataType : "json",
		data : {
			startTime : startTime,
			endTime : endTime
		},
		success : function(result) {
			if (result.state == '0') {
				// 前十大借款人待还金额占比（%）.
				$("#theTopTenStayStillTotalAmountPercentage_id").html("前十大借款人待还金额占比" + result.data.theTopTenStayStillTotalAmountPercentage + "%");
				$("#theTopTenStayStillTotalAmountPercentage_span").css("width", result.data.theTopTenStayStillTotalAmountPercentage + "%");
				// 其它占比（%）.
				$("#otherTheTopTenStayStillTotalAmountPercentage_id").html("其他占比" + result.data.otherTheTopTenStayStillTotalAmountPercentage + "%");
				// 最大单一借款人待还金额占比（%）.
				$("#theBiggestStayStillTotalAmountPercentage_id").html("最大单一借款人待还金额" + result.data.theBiggestStayStillTotalAmountPercentage + "%");
				$("#theBiggestStayStillTotalAmountPercentage_span").css("width", result.data.theBiggestStayStillTotalAmountPercentage + "%");
				// 其它占比（%）.
				$("#otherTheBiggestStayStillTotalAmountPercentage_id").html("其他占比" + result.data.otherTheBiggestStayStillTotalAmountPercentage + "%");
				// 性别男占比.
				A = result.data.male_num_percentage;
				A = parseFloat(A);
				// 性别女占比.
				B = result.data.female_num_percentage;
				B = parseFloat(B);
				// 性别占比.
				genderProportion(A, B);
				// 25岁占比.
				O = result.data.age_25_percentage;
				O = parseFloat(O);
				// 26-30岁占比.
				P = result.data.age_26_30_percentage;
				P = parseFloat(P);
				// 31-35岁占比.
				Q = result.data.age_31_35_percentage;
				Q = parseFloat(Q);
				// 36-40岁占比.
				R = result.data.age_36_40_percentage;
				R = parseFloat(R);
				// 41-45岁占比.
				S = result.data.age_41_45_percentage;
				S = parseFloat(S);
				// 46-50岁占比.
				T = result.data.age_46_50_percentage;
				T = parseFloat(T);
				// 51岁及以上占比.
				U = result.data.age_51_percentage;
				U = parseFloat(U);
				// 年龄占比.
				ageDistribution(O, P, Q, R, S, T, U);
			}
		}
	});
}

/**
 * 平台数据概况.
 */
function platformDataOverview(startTime, endTime) {

	$.ajax({
		url : ctxpath + "/cicmorgan/information/disclosure/platformDataOverview",
		type : "post",
		dataType : "json",
		data : {
			startTime : startTime,
			endTime : endTime
		},
		success : function(result) {
			if (result.state == '0') {
				// 累计借贷金额（万元）
				$("#investTotalAmount_id").html(result.data.investTotalAmount);
				// 累计借贷笔数（笔）
				$("#loanTotalNumbers_id").html(result.data.loanTotalNumbers);
				// 累计算为用户赚取（元）
				$("#interestTotalAmount_id").html(result.data.interestTotalAmount);
				// 借贷利息余额（万元）
				$("#loanUserTotalInterestAmount_id").html(result.data.loanUserTotalInterestAmount);
				// 累计出借人总数（人）
				$("#loanUserInfoTotalNumbers_id").html(result.data.loanUserInfoTotalNumbers);
				// 人均出借金额（元）
				$("#investPerCapitaTotalAmount_id").html(result.data.investPerCapitaTotalAmount);
				// 累计借款人总数（人）
				$("#loanUserTotalNumbers_id").html(result.data.loanUserTotalNumbers);
				// 人均借款金额（元）
				$("#loanPerCapitaTotalAmount_id").html(result.data.loanPerCapitaTotalAmount);
			}
		}
	});
}

/**
 * 本月数据概况.
 */
function thisMonthDataInfo(startTime, endTime) {

	// 期限30天项目出借笔数占比.
	var A = 0;
	// 期限30天项目出借笔数占比.
	var B = 0;
	// 期限90天项目出借笔数占比.
	var C = 0;
	// 期限90天项目出借笔数占比.
	var D = 0;
	// 期限360天项目出借笔数占比.
	var E = 0;
	// 期限360天项目出借笔数占比.
	var F = 0;

	// 期限30天项目成交额占比.
	var O = 0;
	// 期限30天项目成交额占比.
	var P = 0;
	// 期限90天项目成交额占比.
	var Q = 0;
	// 期限90天项目成交额占比.
	var R = 0;
	// 期限360天项目成交额占比.
	var S = 0;
	// 期限360天项目成交额占比.
	var T = 0;

	$.ajax({
		url : ctxpath + "/cicmorgan/information/disclosure/thisMonthDataInfo",
		type : "post",
		dataType : "json",
		data : {
			startTime : startTime,
			endTime : endTime
		},
		success : function(result) {
			if (result.state == '0') {
				// 成交金额（元）
				$("#loanInvestTotalAmount_id").html(result.data.loanInvestTotalAmount);
				// 出借人数（人）
				$("#investPeopleTotalCount_id").html(result.data.investPeopleTotalCount);
				// 出借笔数（笔）
				$("#investTotalCount_id").html(result.data.investTotalCount);
				/**
				 * 成交额占比展示.
				 */
				// 期限180天项目成交额.
				var loanInvestTotalAmountSpan180 = result.data.loanInvestTotalAmountSpan180;
				if (loanInvestTotalAmountSpan180 > 0) {
					$("#mainL").hide();
				} else {
					// 期限30天项目成交额占比.
					O = result.data.turnoverPercentageSpan30;
					O = parseFloat(O);
					// 期限30天项目成交额占比.
					P = parseFloat(100 - O);
					// 期限90天项目成交额占比.
					Q = result.data.turnoverPercentageSpan90;
					Q = parseFloat(Q);
					// 期限90天项目成交额占比.
					R = parseFloat(100 - Q);
					// 期限360天项目出借笔数占比.
					S = result.data.turnoverPercentageSpan360;
					S = parseFloat(S);
					// 期限360天项目出借笔数占比.
					T = parseFloat(100 - S);
					// 成交额占比.
					projectInvestAmountDistribution(O, P, Q, R, S, T);
				}
				/**
				 * 出借笔数占比展示.
				 */
				// 期限180天项目出借笔数.
				var investTotalCount180 = result.data.investTotalCount180;
				if (investTotalCount180 > 0) {
					$("#mainR").hide();
				} else {
					// 期限30天项目出借笔数占比.
					A = result.data.investNumberPercentageSpan30;
					A = parseFloat(A);
					// 期限30天项目出借笔数占比.
					B = parseFloat(100 - A);
					// 期限90天项目出借笔数占比.
					C = result.data.investNumberPercentageSpan90;
					C = parseFloat(C);
					// 期限90天项目出借笔数占比.
					D = parseFloat(100 - C);
					// 期限360天项目出借笔数占比.
					E = result.data.investNumberPercentageSpan360;
					E = parseFloat(E);
					// 期限360天项目出借笔数占比.
					F = parseFloat(100 - E);
					// 项目出借笔数占比.
					projectInvestNumberDistribution(A, B, C, D, E, F);
				}
			}
		}
	});
}

var myChart01 = echarts.init(document.getElementById('sexDistribution'));
var myChart02 = echarts.init(document.getElementById('ageDistribution'));
var mainL = echarts.init(document.getElementById("mainL"));
var mainR = echarts.init(document.getElementById("mainR"));
var dataStyle = {
	normal : {
		label : {
			show : false
		},
		labelLine : {
			show : false
		}
	}
};
var placeHolderStyle = {
	normal : {
		color : 'rgba(0,0,0,0)',
		label : {
			show : false
		},
		labelLine : {
			show : false
		}
	},
	emphasis : {
		color : 'rgba(0,0,0,0)'
	}
};

/* 项目金额出借占比 */
/**
 * 项目成交额占比.
 */
function projectInvestAmountDistribution(O, P, Q, R, S, T) {
	var optionL = {
		title : {
			text : '项目金额出借占比',

			x : 'center',
			y : 'center',
			itemGap : 20,
			textStyle : {
				color : '#666',
				fontFamily : '微软雅黑',
				fontSize : 20,
				fontWeight : 'bolder'
			}
		},
		color : [ '#f7b58d', '#da8e93', '#a0a6d7' ],
		legend : {
			orient : 'vertical',
			x : document.getElementById('mainL').offsetWidth / 2,
			y : 45,
			itemGap : 12,
			data : [ '30天项目' + O + '%', '90天项目' + Q + '%', '360天项目' + S + '%' ]
		},
		toolbox : {
			show : true,
			feature : {
				mark : {
					show : true
				},
				dataView : {
					show : true,
					readOnly : false
				},
				restore : {
					show : true
				},
				saveAsImage : {
					show : true
				}
			}
		},
		series : [ {
			name : '1',
			type : 'pie',
			clockWise : false,
			radius : [ 125, 150 ],
			itemStyle : dataStyle,
			data : [ {
				value : O,
				name : '30天项目' + O + '%'
			}, {
				value : P,
				name : 'invisible',
				itemStyle : placeHolderStyle
			} ]
		}, {
			name : '2',
			type : 'pie',
			clockWise : false,
			radius : [ 100, 125 ],
			itemStyle : dataStyle,
			data : [ {
				value : Q,
				name : '90天项目' + Q + '%'
			}, {
				value : R,
				name : 'invisible',
				itemStyle : placeHolderStyle
			} ]
		}, {
			name : '3',
			type : 'pie',
			clockWise : false,
			radius : [ 75, 100 ],
			itemStyle : dataStyle,
			data : [ {
				value : S,
				name : '360天项目' + S + '%'
			}, {
				value : T,
				name : 'invisible',
				itemStyle : placeHolderStyle
			} ]
		} ]
	};
	mainL.setOption(optionL);
}
/* 项目出借笔数占比 */
/**
 * 项目占比. A：期限30天项目成交额占比. B：期限90天项目成交额占比. C：期限360天项目成交额占比. D：期限30天项目出借笔数占比.
 * E：期限90天项目出借笔数占比. F：期限360天项目出借笔数占比.
 */
function projectInvestNumberDistribution(A, B, C, D, E, F) {
	var optionR = {
		title : {
			text : '项目出借笔数占比',
			x : 'center',
			y : 'center',
			itemGap : 20,
			textStyle : {
				color : '#666',
				fontFamily : '微软雅黑',
				fontSize : 20,
				fontWeight : 'bolder'
			}
		},
		color : [ '#f7b58d', '#da8e93', '#a0a6d7' ],
		legend : {
			orient : 'vertical',
			x : document.getElementById('mainR').offsetWidth / 2,
			y : 45,
			itemGap : 12,
			data : [ '30天项目' + A + '%', '90天项目' + C + '%', '360天项目' + E + '%' ]
		},
		toolbox : {
			show : true,
			feature : {
				mark : {
					show : true
				},
				dataView : {
					show : true,
					readOnly : false
				},
				restore : {
					show : true
				},
				saveAsImage : {
					show : true
				}
			}
		},
		series : [ {
			name : '1',
			type : 'pie',
			clockWise : false,
			radius : [ 125, 150 ],
			itemStyle : dataStyle,
			data : [ {
				value : A,
				name : '30天项目' + A + '%'
			}, {
				value : B,
				name : 'invisible',
				itemStyle : placeHolderStyle
			} ]
		}, {
			name : '2',
			type : 'pie',
			clockWise : false,
			radius : [ 100, 125 ],
			itemStyle : dataStyle,
			data : [ {
				value : C,
				name : '90天项目' + C + '%'
			}, {
				value : D,
				name : 'invisible',
				itemStyle : placeHolderStyle
			} ]
		}, {
			name : '3',
			type : 'pie',
			clockWise : false,
			radius : [ 75, 100 ],
			itemStyle : dataStyle,
			data : [ {
				value : E,
				name : '360天项目' + E + '%'
			}, {
				value : F,
				name : 'invisible',
				itemStyle : placeHolderStyle
			} ]
		} ]
	};
	mainR.setOption(optionR);
}

/* 性别占比 */
/**
 * 性别占比.
 */
function genderProportion(A, B) {
	var optionSex = {

		title : {
			text : '性别占比',
			x : 'center',
			y : 'bottom',
			textStyle : {
				fontSize : 16,
				color : '#666',
				fontWeight : "normal"
			}
		},

		toolbox : {
			show : true,
			feature : {
				mark : {
					show : true
				},
				dataView : {
					show : true,
					readOnly : false
				},
				restore : {
					show : true
				},
				saveAsImage : {
					show : true
				}
			}
		},

		calculable : true,
		color : [ '#6a669e', '#ef9592' ],
		series : [ {

			name : '访问来源',
			type : 'pie',
			radius : '55%',
			center : [ '50%', '50%' ],
			data : [ {
				value : A,
				name : '男' + A + '%'
			},

			{
				value : B,
				name : '女' + B + '%'
			}, ]
		} ]
	};
	myChart01.setOption(optionSex);
}

/*--年龄分布--*/
/**
 * 年龄分布占比.
 */
function ageDistribution(O, P, Q, R, S, T, U) {
	var optionAge = {
		title : {
			text : '年龄分布',
			x : 'center',
			y : 'bottom',
			textStyle : {
				fontSize : 16,
				color : '#666',
				fontWeight : "normal"
			}
		},

		toolbox : {
			show : true,
			feature : {
				mark : {
					show : true
				},
				dataView : {
					show : true,
					readOnly : false
				},
				restore : {
					show : true
				},
				saveAsImage : {
					show : true
				}
			}
		},
		calculable : true,
		color : [ '#6a669e', '#ef9592', '#fac97a', '#d6e8ad', '#c3f3d4', '#6080a0', '#466b90' ],
		series : [ {
			name : '访问来源',
			type : 'pie',
			radius : '55%',
			center : [ '50%', '50%' ],
			data : [ {
				value : O,
				name : '25岁' + O + '%'
			}, {
				value : P,
				name : '26~30岁' + P + '%'
			}, {
				value : Q,
				name : '31~35岁' + Q + '%'
			}, {
				value : R,
				name : '36~40岁' + R + '%'
			}, {
				value : S,
				name : '41~45岁' + S + '%'
			}, {
				value : T,
				name : '46~50岁' + T + '%'
			}, {
				value : U,
				name : '51岁及以上' + U + '%'
			} ]
		} ]
	};
	myChart02.setOption(optionAge);
}
