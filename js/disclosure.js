jQuery.support.cors = true;

$(function() {

	// 借款标的情况.
	queryLoanProjectInfo();

	// 借款人情况.
	queryLoanPeopletInfo();

	// 查询逾期情况.
	queryLoanOverdueInfo();

	// 代偿情况.
	queryLoanReplaceRepayInfo();

	// 出借人情况.
	queryLoanUserInfo();
});

/**
 * FN：queryLoanUserInfo. DESC：出借人情况.
 */
function queryLoanUserInfo() {

	// 25岁占比.
	var A = 0;
	// 26-30岁占比.
	var B = 0;
	// 31-35岁占比.
	var C = 0;
	// 36-40岁占比.
	var D = 0;
	// 41-45岁占比.
	var E = 0;
	// 46-50岁占比.
	var F = 0;
	// 51岁以上占比.
	var G = 0;
	// 男性占比.
	var X = 0;
	// 女性占比.
	var Y = 0;

	$.ajax({
		url : ctxpath + "/cicmorgan/information/disclosure/queryLoanUserInfo",
		type : "post",
		dataType : "json",
		data : {},
		success : function(result) {
			if (result.state == '0') {
				// 累计出借人出借总额.
				$("#investTotalAmount_id").html(result.data.investTotalAmount);
				// 累计为出借人赚钱的利息总额.
				$("#interestTotalAmount_id").html(result.data.interestTotalAmount);
				// 累计出借人数量.
				$("#loanUserInfoTotalNumbers_id").html(result.data.loanUserInfoTotalNumbers);
				// 当前出借人数量.
				$("#nowLoanUserInfoNumbers_id").html(result.data.nowLoanUserInfoNumbers);
				// 人均累计出借金额(元).
				$("#investPerCapitaTotalAmount_id").html(result.data.investPerCapitaTotalAmount);
				// 最大单户出借余额占比(%).
				$("#theFirstInvestTotalAmountPercentage_id").html(result.data.theFirstInvestTotalAmountPercentage + "%");
				// 最大十户出借余额占比(%).
				$("#theTopTenInvestTotalAmountPercentage_id").html(result.data.theTopTenInvestTotalAmountPercentage + "%");
				// 男性占比.
				X = result.data.male_num_percentage;
				X = parseFloat(X);
				// 女性占比.
				Y = result.data.female_num_percentage;
				Y = parseFloat(Y);
				sexDistribution(X, Y);
				// 25岁占比.
				A = result.data.age_25_percentage;
				A = parseFloat(A);
				// 26-30岁占比.
				B = result.data.age_26_30_percentage;
				B = parseFloat(B);
				// 31-35岁占比.
				C = result.data.age_31_35_percentage;
				C = parseFloat(C);
				// 36-40岁占比.
				D = result.data.age_36_40_percentage;
				D = parseFloat(D);
				// 41-45岁占比.
				E = result.data.age_41_45_percentage;
				E = parseFloat(E);
				// 46-50岁占比.
				F = result.data.age_46_50_percentage;
				F = parseFloat(F);
				// 51岁以上占比.
				G = result.data.age_51_percentage;
				G = parseFloat(G);
				ageDistribution(A, B, C, D, E, F, G);
			}
		}
	});
}

/**
 * FN：queryLoanReplaceRepayInfo. DESC：代偿情况.
 */
function queryLoanReplaceRepayInfo() {
	$.ajax({
		url : ctxpath + "/cicmorgan/information/disclosure/queryLoanReplaceRepayInfo",
		type : "post",
		dataType : "json",
		data : {},
		success : function(result) {
			if (result.state == '0') {
				// 累计代偿金额.
				$("#theCumulativeReplaceRepayAmount_id").html(result.data.theCumulativeReplaceRepayAmount);
				// 累计代偿笔数.
				$("#theCumulativeReplaceRepayNumbers_id").html(result.data.theCumulativeReplaceRepayNumbers);
			}
		}
	});
}

/**
 * FN：queryLoanPeopletInfo. DESC：借款人情况.
 */
function queryLoanPeopletInfo() {

	// 前十大借款人待还金额占比（%）.
	var Q = 0;
	// 其它占比（%）.
	var W = 0;

	// 最大单一借款人待还金额占比（%）.
	var E = 0;
	// 其它占比（%）.
	var R = 0;

	$.ajax({
		url : ctxpath + "/cicmorgan/information/disclosure/queryLoanPeopletInfo",
		type : "post",
		dataType : "json",
		data : {},
		success : function(result) {
			if (result.state == '0') {
				// 累计借款人数量（融资主体为借款人）.
				$("#loanUserTotalNumbers_id").html(result.data.loanUserTotalNumbers);
				// 当前借款人数量.
				$("#nowLoanUserTotalNumbers_id").html(result.data.nowLoanUserTotalNumbers);
				// 人均累计借贷金额(元).
//				$("#loanAllUserPerCapitaTotalAmount_id").html("967,422.18");
				$("#loanAllUserPerCapitaTotalAmount_id").html(result.data.loanAllUserPerCapitaTotalAmount);
				// 前十大借款人待还金额占比（%）.
				Q = result.data.theTopTenStayStillTotalAmountPercentage;
				Q = parseFloat(Q);
				// 其它占比（%）.
				W = result.data.otherTheTopTenStayStillTotalAmountPercentage;
				W = parseFloat(W);

				// 最大单一借款人待还金额占比（%）.
				E = result.data.theBiggestStayStillTotalAmountPercentage;
				E = parseFloat(E);
				// 其它占比（%）.
				R = result.data.otherTheBiggestStayStillTotalAmountPercentage;
				R = parseFloat(R);

				// 前十大借款人待还金额占比（%）.
				ageEr(Q, W);
				// 最大单一借款人待还金额占比（%）.
				sexEr(E, R);
			}
		}
	});
}

/**
 * FN：queryLoanProjectInfo. DESC：借款标的情况.
 */
function queryLoanProjectInfo() {
	$.ajax({
		url : ctxpath + "/cicmorgan/information/disclosure/queryLoanProjectInfo",
		type : "post",
		dataType : "json",
		data : {},
		success : function(result) {
			if (result.state == '0') {
				// 累计借款金额.
				$("#loanTotalAmount_id").html(result.data.investTotalAmount);
				// 累计借款笔数.
				$("#loanTotalNumbers_id").html(result.data.loanTotalNumbers);
				// 借贷本金余额.
				$("#loanTotalAvailableAmount_id").html(result.data.loanTotalAvailableAmount);
				// 借贷利息余额.
				$("#loanUserTotalInterestAmount_id").html(result.data.loanUserTotalInterestAmount);
				// 借款余额笔数.
				$("#loanTotalAvailableNumbers_id").html(result.data.loanTotalAvailableNumbers);
				// 关联关系借款金额.
				$("#loanRelationalTotalAmount_id").html(result.data.loanRelationalTotalAmount);
				// 关联关系借款笔数.
				$("#loanRelationalTotalNumbers_id").html(result.data.loanRelationalTotalNumbers);
			}
		}
	});
}

/**
 * FN：queryLoanOverdueInfo. DESC：逾期情况.
 */
function queryLoanOverdueInfo() {
	$.ajax({
		url : ctxpath + "/cicmorgan/information/disclosure/queryLoanOverdueInfo",
		type : "post",
		dataType : "json",
		data : {},
		success : function(result) {
			if (result.state == '0') {
				// 逾期金额.
				$("#overdueAmount_id").html(result.data.overdueAmount);
				// 逾期笔数.
				$("#overdueNumbers_id").html(result.data.overdueNumbers);
				// 逾期90天以上金额.
				$("#overdue90DaysAmount_id").html(result.data.overdue90DaysAmount);
				// 逾期90天以上笔数.
				$("#overdue90DaysNumbers_id").html(result.data.overdue90DaysNumbers);
				// 金额逾期率.
				$("#amountOverdueRate_id").html(result.data.amountOverdueRate + "%");
				// 项目逾期率.
				$("#projectOverdueRate_id").html(result.data.projectOverdueRate + "%");
				// 项目分级90逾期率.
				$("#projectClassificationOverdueRate90_id").html(result.data.projectClassificationOverdueRate90 + "%");
				// 项目分级180逾期率.
				$("#projectClassificationOverdueRate180_id").html(result.data.projectClassificationOverdueRate180 + "%");
				// 项目分级360逾期率.
				$("#projectClassificationOverdueRate360_id").html(result.data.projectClassificationOverdueRate360 + "%");
				// 金额分级90逾期率.
				$("#amountClassificationOverdueRate90_id").html(result.data.amountClassificationOverdueRate90 + "%");
				// 金额分级180逾期率.
				$("#amountClassificationOverdueRate180_id").html(result.data.amountClassificationOverdueRate180 + "%");
				// 金额分级360逾期率.
				$("#amountClassificationOverdueRate360_id").html(result.data.amountClassificationOverdueRate360 + "%");
			}
		}
	});
}

/**
 * FN:ageEr. DESC:前十大借款人待还金额占比（%）.
 * 
 * @param Q
 * @param W
 */
function ageEr(Q, W) {
	$("#ageEr").highcharts({
		title : {
			text : '前十大借款<br/>人待还金额',
			align : 'center',
			verticalAlign : 'middle',
			y : -30,
			style : {
				'color' : '#999',
				'fontFamily' : '微软雅黑',
				"marginTop" : "-20px"
			}
		},
		tooltip : {
			pointFormat : '{series.name}: <b>{point.percentage:.1f}%</b>'
		},
		colors : [ '#ff9650', '#6cc9f9', '#00c0dd' ],
		plotOptions : {
			pie : {
				allowPointSelect : true,
				cursor : 'pointer',
				borderWidth : null,
				enabled : true,
				dataLabels : {
					enabled : false,
					format : '<b>{point.name}</b>: {point.percentage:.1f} %',
					style : {
						fontFamily : "Microsoft Yahei"
					}
				},
				showInLegend : true,
			}
		},
		credits : {
			enabled : false
		},
		legend : { // 控制图例显示位置
			align : 'center',
			verticalAlign : 'bottom',
			borderWidth : 0,
			x : 0, // 间隔x轴的间隔
			y : 0, // 间隔Y轴的间隔
			itemStyle : {
				'fontSize' : '12px',
				'color' : '#999',
				'fontFamily' : '微软雅黑'
			},
			labelFormatter : function() {
				return this.name + this.percentage.toFixed(1) + '%';
			}
		},
		series : [ {
			type : 'pie',
			name : '比例',
			innerSize : '75%',
			data : [ [ '前十大借款人待还金额占比', Q ], [ '其他占比', W ] ]
		} ]
	});
}

/**
 * FN:sexEr. DESC:最大单一借款人待还金额占比（%）.
 * 
 * @param E
 * @param R
 */
function sexEr(E, R) {
	$("#sexEr").highcharts({
		title : {
			text : '最大单一借款<br/>人待还金额',
			align : 'center',
			verticalAlign : 'middle',
			y : -30,
			style : {
				'color' : '#999',
				'fontFamily' : '微软雅黑'
			}
		},
		tooltip : {
			pointFormat : '{series.name}: <b>{point.percentage:.1f}%</b>'
		},
		colors : [ '#ff675b', '#81bfff' ],
		plotOptions : {
			pie : {
				allowPointSelect : true,
				cursor : 'pointer',
				borderWidth : null,
				enabled : true,
				dataLabels : {
					enabled : false,
					format : '<b>{point.name}</b>: {point.percentage:.1f} %',
					style : {
						fontFamily : "Microsoft Yahei"
					}
				},
				showInLegend : true,
			}
		},
		credits : {
			enabled : false
		},
		legend : {
			align : 'center',
			verticalAlign : 'bottom',
			borderWidth : 0,
			x : 0,
			y : 0,
			itemStyle : {
				'fontSize' : '12px',
				'color' : '#999',
				'fontFamily' : '微软雅黑'
			},
			labelFormatter : function() {
				return this.name + this.percentage.toFixed(1) + '%';
			}
		},

		series : [ {
			type : 'pie',
			name : '比例',
			innerSize : '75%',

			data : [ [ '最大单一借款人待还金额占比', E ], [ '其他占比', R ] ]
		} ]
	});
}
// 性别分布占比.
function sexDistribution(X, Y) {
	$("#sexDistribution").highcharts({
		title : {
			text : '性别分布',
			align : 'center',
			verticalAlign : 'middle',
			y : -10,
			style : {
				'color' : '#999',
				'fontFamily' : '微软雅黑',
				"marginTop" : "0"
			}
		},
		tooltip : {
			pointFormat : '{series.name}: <b>{point.percentage:.1f}%</b>'
		},
		colors : [ '#ff9650', '#40a2fb', '#e5343a' ],
		plotOptions : {
			pie : {
				allowPointSelect : true,
				cursor : 'pointer',
				borderWidth : null,
				enabled : true,
				dataLabels : {
					enabled : false,
					format : '<b>{point.name}</b>: {point.percentage:.1f} %',
					style : {
						fontFamily : "Microsoft Yahei"
					}
				},
				showInLegend : true,
			}
		},
		credits : {
			enabled : false
		},
		legend : { // 控制图例显示位置
			align : 'center',
			verticalAlign : 'bottom',
			borderWidth : 0,
			x : 0, // 间隔x轴的间隔
			y : 0, // 间隔Y轴的间隔
			itemStyle : {
				'fontSize' : '12px',
				'color' : '#999',
				'fontFamily' : '微软雅黑'
			},
			labelFormatter : function() {
				return this.name + this.percentage.toFixed(1) + '%';
			}
		},
		series : [ {
			type : 'pie',
			name : '比例',
			innerSize : '75%',
			data : [ [ '男', X ], [ '女', Y ] ]
		} ]
	});
}

// 年龄分布占比.
function ageDistribution(A, B, C, D, E, F, G) {
	$("#ageDistribution").highcharts({
		title : {
			text : '年龄分布',
			align : 'center',
			verticalAlign : 'middle',
			y : -60,
			style : {
				'color' : '#999',
				'fontFamily' : '微软雅黑',
				"marginTop" : "0px"
			}
		},
		tooltip : {
			pointFormat : '{series.name}: <b>{point.percentage:.1f}%</b>'
		},
		colors : [ '#ff9650', '#e97758', '#e9d77e', '#dbdbdb', '#c2c7d7', '#78aefa', '#a2cf88', '#e8a068' ],
		plotOptions : {
			pie : {
				allowPointSelect : true,
				cursor : 'pointer',
				borderWidth : null,
				enabled : true,
				dataLabels : {
					enabled : false,
					format : '<b>{point.name}</b>: {point.percentage:.1f} %',
					style : {
						fontFamily : "Microsoft Yahei"
					}
				},
				showInLegend : true,
			}
		},
		credits : {
			enabled : false
		},
		legend : { // 控制图例显示位置
			align : 'center',
			verticalAlign : 'bottom',
			borderWidth : 0,
			x : 0, // 间隔x轴的间隔
			y : 0, // 间隔Y轴的间隔
			itemStyle : {
				'fontSize' : '12px',
				'color' : '#999',
				'fontFamily' : '微软雅黑'
			},
			layout : 'horizontal',
			labelFormatter : function() {
				return this.name + this.percentage.toFixed(1) + '%';
			}
		},
		series : [ {
			type : 'pie',
			name : '比例',
			innerSize : '75%',
			data : [ [ '25岁', A ], [ '26~30岁', B ], [ '31~35岁', C ], [ '36~40岁', D ], [ '41~45岁', E ], [ '46~50岁', F ], [ '51岁及以上', G ] ]
		} ]
	});
}
