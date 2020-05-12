var projectId = getArgumentsByName("id");
var pageNo = parseInt(1);
var pageSize = parseInt(5);
var vouid;
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
var bindCard;
var creditInfoId;
var isShow = true;
var bindCard;
/*项目详情*/
$(function() {
	Initialization();
});

function Initialization() {
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
				var userName = result.data.name;
				bindCard = result.data.cgbBindBankCard;
				isTest = result.data.isTest
				getProjectInfo(userName);
				projectRepayPlan(1, 14);
				$(".program_info_space").show();
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
							availableAmount = formatCurrency(json.data.availableAmount);
							$("#loginAccount").show().html(availableAmount + "元");
							$(".recharge").css("visibility", "visible");

						} else {
							$("#loginAccount").show().html("登录后可查看余额").addClass("no_login").click(function() {
								window.location.href = "login.html";
								_czc.push(['_trackEvent', '出借详情-顶部右半部分（未登录）', '点击', '立即登录按钮']);
							});
							$.cookie('token', null);
							$(".program_info_space").remove();
							$(".program_info_login_null").show();
						}
					}
				});
			} else {
				getProjectInfo();
				$("#loginAccount").show().html("登录后可查看余额").addClass("no_login").click(function() {
					window.location.href = "login.html";
				});
				$.cookie('token', null);
				console.log(result);
			}
		}
	});
	//还款计划
	projectRepayPlan(1, 14);
}

//出借记录
$("#projectInvestList").click(function() {
	projectInvestList(1, 7);
});
//风控相关
$("#windControl").click(function() {
	windControl();
});
//股东信息
$("#LoanBasicInfoBtn").click(function() {
	getZtmgLoanBasicInfo();
});
//获取项目信息
function getProjectInfo(userName) {
	if(projectId != null && projectId.trim().length > 0) {
		$.ajax({
			url: ctxpath + "/project/getProjectInfoWap",
			type: 'post',
			dataType: 'json',
			data: {
				from: '1',
				projectid: projectId
			},
			success: function(json) {
				// 查找成功.
				if(json.state == 0) {
					var data = json.data;
					var projectProductType = data.projectProductType;
					$("#projectProductType").val(data.projectProductType);
					if(projectProductType == 2) { //供应链
						$("#projectTypeTop").addClass("type_02");
						$("#question01").show();
						$("#question02").hide();
						$("#agreementFile").attr("href", "doc/scf.pdf");
						var level = data.level;
						level = level * 10;
						var starAll = parseInt(level / 10);
						var starLevel = level % 10;
						$("#star").html("<i></i><i></i><i></i><i></i><i></i>");
						var starList = $("#star i");
						for(var i = 0; i < starAll; i++) {
							starList[i].className = "all";
						}
						if(starLevel > 0) {
							if(starAll == 0) {
								$("#star i:first").addClass("half");
							} else {

								$("#star i.all:last").next().addClass("half");
							}
						}
						if(level == 50) {
							$("#riskName").html("极低风险");
						} else if(level == 45) {
							$("#riskName").html("低风险");
						} else if(level == 40) {
							$("#riskName").html("较低风险");
						} else if(level == 35) {
							$("#riskName").html("中等风险");
						} else if(level == 30) {
							$("#riskName").html("较高风险");
						} else {
							$("#riskName").html("高风险");
						}
					} else {
						$("#star").html("<i class='all'></i><i class='all'></i><i class='all'></i><i class='all'></i><i></i>");
						$("#riskName").html("较低风险");
						$("#projectTypeTop").addClass("type_01");
						$("#antNo").remove(); //无付款方
						$("#question01").hide();
						$("#question02").show();
						$("#agreementFile").attr("href", "doc/axt.pdf");
					}
					var creditUrl = data.creditUrl;
					if(creditUrl == "null" || creditUrl == null || creditUrl == "暂无") {
						creditUrl = "javascript:;";
					}
					creditInfoId = data.creditInfoId;
					$("#project_name").html(data.projectName + '(' + data.sn + ')'); //项目名称

					var interestRateIncrease = data.interestRateIncrease; //加息利率
					interestRateIncrease = toFixed2(interestRateIncrease);
					var rate = toFixed2(data.rate);
					var ratePI = parseInt(rate);
					var ratePF = rate.toString().split(".")[1];

					if(interestRateIncrease == 0) {
						$("#projectRate").html(rate + "<i class='font_size22'>%</i>"); // 预期利率

					} else {
						var rateBase = rate - interestRateIncrease;
						rateBase = toFixed2(rateBase);
						var rateBasePI = parseInt(rateBase);
						var rateBasePF = rateBase.toString().split(".")[1];

						$("#projectRate").html(rateBasePI + '.' + rateBasePF + "<i class='font_size22'>%+" + interestRateIncrease + "%</i>"); // 预期年利率
					}

					$("#projectspan").html(data.span + "<i class='font_size22'>天</i>"); // 项目期限
					$("#projectAmount").html(toFixed2(data.amount) + "<i class='font_size22'>元</i>"); //出借金额
					//募集进度

					var currentamount = parseFloat(data.currentamount);
					var amount = parseFloat(data.amount);
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
					$("#persent").attr("style", "width:" + percentage + "%!important");
					$("#projectSchedule").html(percentage + "%").attr("style", "left:" + percentage + "%");
					$("#projectsurplus").html(formatCurrency(data.balanceamount) + "元"); // 剩余金额
					//$("#projectminamount").html(data.minamount + "元起投"); // 起投金额

					if(data.proState == "3") {
						$("#project_state").val("1");
						$("#proState").val("3");
						var spanTime = '<span >即将上线(' +
							'<i id="invlNTtimeD"></i>天' +
							'<i id="invlNTtimeH"></i>时' +
							'<i id="invlNTtimeM"></i>分' +
							'<i id="invlNTtimeS"></i>秒' +
							')</span>';
						$("#invest_btn").html(spanTime).addClass("invest_btn_once default");
						if(token == "" || token == null) {
							$(".program_info_login_null").show();
						} else {
							$(".program_info_space").show();
						}

						setInterval("toDays(0)", 1000);
						$("#replTit,#replCon").remove();
						$("#interestDate").html("满标当日计息"); //起息时间

					} else if(data.proState == "5" || data.proState == "6") {
						$("#project_state").val("1");
						$("#invest_btn").html("<span>还款中</span>").addClass("default");

						$("#proStatic").val(5);
						if(userName == "" || userName == null) {
							$(".program_info_login_null").show();
							$(".program_info_space").remove();
						} else {
							investList(data, userName);
						}
						$("#interestDate").html(data.loandate); //起息时间

					} else if(data.proState == "7") {
						$("#project_state").val("1");

						$("#invest_btn").html("<span>已还完</span>").addClass("default");

						$("#proStatic").val(5);

						if(userName == "" || userName == null) {
							$(".program_info_login_null").show();
							$(".program_info_space").remove();
						} else {
							investList(data, userName);
						}
						$("#interestDate").html(data.loandate); //起息时间

					} else if(checkDate(new Date().format("yyyyMMddhhmmss"), data.loandate)) {
						$("#project_state").val("1");

						$("#invest_btn").html("<span>已过期</span>").addClass("default");
						if(token == "" || token == null) {
							$(".program_info_login_null").show();
						} else {
							$(".program_info_space").show();
						}
						$("#replTit,#replCon").remove();
						$("#interestDate").html("满标当日计息"); //起息时间
					} else if(data.proState == "4") {
						$("#project_state").val("1");
						if(token == "" || token == null) {
							$("#invest_btn").html("<span>立即登录</span>").attr("href", "login.html");
							$(".program_info_login_null").show();
						} else {
							$("#invest_btn").html("<span>立即加入</span>");
							$(".program_info_space").show();
						}
						$("#replTit,#replCon").remove();
						$("#interestDate").html("满标当日计息"); //起息时间
					}

					//项目介绍
					$("#project_name2").html(data.projectName + "(" + data.sn + ")");
					$("#borrowerName").html(data.borrowerCompanyName); //借款方
					$("#paymentName").html(data.replaceRepayCompanyName); //付款方
					$("#paymentName").attr("href", creditUrl);
					$("#projectAmount2").html(toFixed2(data.amount) + "元"); //借款金额
					$("#projectSpan2").html(data.span + "天");
					$("#project_useful").html(data.purpose); //项目用途
					$("#project_rate2").html(rate + "%");

					// 判断代偿方，展示（熙耘）关系说明文件.
					if(data.replaceRepayCompanyName == "宁波熙耘科技有限公司"){ // 熙云关系说明文件.
						$("#relationFilePath").attr("href", "https://www.cicmorgan.com/" + "images/about/relation_file.jpg");
					} else {
						$("#relationFilePath").attr("href", "javascript:(void);")
					}

					if(interestRateIncrease == 0) {
						$("#project_rate2").html(rate + "%"); // 预期年化利率

					} else {
						var rateBase = rate - interestRateIncrease;
						rateBase = toFixed2(rateBase);
						var rateBasePI = parseInt(rateBase);
						var rateBasePF = rateBase.toString().split(".")[1];

						$("#project_rate2").html(rateBasePI + '.' + rateBasePF + "%+" + interestRateIncrease + "%"); // 预期利率
					}

					$("#repaytype").html(data.repaytype);//还款方式
					$("#loanMoney").html(data.minamount+"元起投，"+data.stepamount+"元递增");
					$("#borrowerCompanyName").html(data.borrowerCompanyName); //借款方

					//实缴资本
					if(data.ztmgLoanBasicInfoEntity != null) {

						if(data.ztmgLoanBasicInfoEntity.declarationFilePath == "" || data.ztmgLoanBasicInfoEntity.declarationFilePath == null) {
							$("#declarationFilePath").attr("href", "javascript:;")
						} else {
							$("#declarationFilePath").attr("href", "https://www.cicmorgan.com/" + data.ztmgLoanBasicInfoEntity.declarationFilePath);
						}

						if(data.ztmgLoanBasicInfoEntity.contributedCapital == "" || data.ztmgLoanBasicInfoEntity.contributedCapital == null) {
							$("#contributedCapital").html("---");
						} else {
							$("#contributedCapital").html(data.ztmgLoanBasicInfoEntity.contributedCapital + "元");
						}
						//其他平台借逾期情况
						if(data.ztmgLoanBasicInfoEntity.otherCreditInformation == "" || data.ztmgLoanBasicInfoEntity.otherCreditInformation == null) {
							$("#otherCreditInformation").html("---");
						} else {
							$("#otherCreditInformation").html(formatCurrency(data.ztmgLoanBasicInfoEntity.otherCreditInformation) + "元");
						}
						//所属行业
						if(data.ztmgLoanBasicInfoEntity.industry == "" || data.ztmgLoanBasicInfoEntity.industry == null) {
							$("#industry").html("---");
						} else {
							$("#industry").html(data.ztmgLoanBasicInfoEntity.industry);
						}
						//经营区域
						if(data.ztmgLoanBasicInfoEntity.scope == "") {
							$("#operatingArea").html("---");
						} else {
							$("#operatingArea").html(data.ztmgLoanBasicInfoEntity.scope);
						}
						//年收入
						if(data.ztmgLoanBasicInfoEntity.annualRevenue == "" || data.ztmgLoanBasicInfoEntity.annualRevenue == null) {
							$("#annualRevenue").html("---");
						} else {
							$("#annualRevenue").html(toFixed2(data.ztmgLoanBasicInfoEntity.annualRevenue));
						}
						//注册资本

						$("#borrowerRegisterAmount").html(data.ztmgLoanBasicInfoEntity.registeredCapital + "元");
						//注册地址

						$("#address").html(data.ztmgLoanBasicInfoEntity.registeredAddress);

						//成立时间

						if(data.ztmgLoanBasicInfoEntity.setUpTime == "" || data.ztmgLoanBasicInfoEntity.setUpTime == null) {

							$("#borrowerRegisterDate").html("--");
						} else {
							var time = data.ztmgLoanBasicInfoEntity.setUpTime;
							time = time.substr(0, 10);
							$("#borrowerRegisterDate").html(time);
						}

						//法定代表人
						if(data.ztmgLoanBasicInfoEntity.operName == "" || data.ztmgLoanBasicInfoEntity.operName == null) {
							$("#agentPersonName").html("---");
						} else {

							$("#agentPersonName").html(data.ztmgLoanBasicInfoEntity.operName);
						}

					} else {
						$("#contributedCapital").html("---");
						$("#otherCreditInformation").html("---");
						$("#industry").html("---");
						$("#operatingArea").html("---");
						$("#annualRevenue").html("---");
						$("#borrowerRegisterAmount").html("---");
						$("#address").html("---");
						$("#borrowerRegisterDate").html("---");
					}

					/*办公地址*/
					if(data.address == "" || data.address == null) {
						$("#addressBS").html("---");
					} else {
						$("#addressBS").html(data.address);
					}

					//经营财务状况
					if(data.businessFinancialSituation == "" || data.businessFinancialSituation == null) {
						$("#businessFinancialSituation").html("---");
					} else {
						$("#businessFinancialSituation").html(data.businessFinancialSituation);
					}
					//还款能力变化
					if(data.abilityToRepaySituation == "" || data.abilityToRepaySituation == null) {
						$("#abilityToRepaySituation").html("---");
					} else {
						$("#abilityToRepaySituation").html(data.abilityToRepaySituation);
					}
					//是否涉诉
					if(data.litigationSituation == "" || data.litigationSituation == null) {
						$("#litigationSituation").html("---");
					} else {
						$("#litigationSituation").html(data.litigationSituation);
					}
					//是否行政处罚
					if(data.administrativePunishmentSituation == "" || data.administrativePunishmentSituation == null) {
						$("#administrativePunishmentSituation").html("---");
					} else {
						$("#administrativePunishmentSituation").html(data.administrativePunishmentSituation);
					}
					//在本平台逾期情况
					if(data.platformOverdueSituation == "" || data.platformOverdueSituation == null) {
						$("#platformOverdueSituation").html("---");
					} else {
						$("#platformOverdueSituation").html(data.platformOverdueSituation);
					}

					$("#sourceofrepayment").html(data.sourceOfRepayment); //还款来源
					$("#repaymentGuaranteeMeasures").html(data.repaymentGuaranteeMeasures); //还款保障措施

					$("#project_introduction").html(data.projectcase); // 项目介绍
					$("#project_lacation").html(data.locus);
					$("#protect_plan").html(data.guaranteescheme);
					// 隐藏域赋值
					$("#project_id").val(projectId); // 项目id
					$("#project_span").val(data.span); // 项目期限
					$("#project_amount").val(data.amount); // 项目融资金额
					$("#project_rate").val(data.rate); // 年化利率
					$("#loan_date").val(data.loandate); // 放款日期
					$("#project_minamount").val(data.minamount); // 起投金额
					$("#project_maxamount").val(data.maxamount); // 最大金额
					$("#project_stepamount").val(data.stepamount); // 递增金额
					$("#project_balanceamount").val(data.balanceamount); // 可出借金额
					$("#temp_countdowndate").val(data.countdowndate);

					isCanUseCoupon = data.isCanUseCoupon;
					balanceAmount = data.balanceamount;
					minAmount = data.minamount;

				}
			}
		});
	}
}

function windControl() {
	var proType = $("#projectProductType").val();
	$.ajax({
		url: ctxpath + "/project/getProjectInfoAnnex",
		type: 'post',
		dataType: 'json',
		data: {
			from: '2',
			projectid: projectId
		},
		success: function(json) {
			if(json.state == 0) {
				var data = json.data;

				$("#risk_item_msg").html("<p>" + data.guaranteescheme + "</p>"); /*风控措施*/
				if(proType == 1) { //安心投
					var proDocimgs = data.proimg;
					var wgimglist = data.wgimglist;
					var docimgs = data.docimgs;
					var filePro = "",
						fileTb = "",
						fileRisk = "";

					$.each(proDocimgs, function(index, item) {

						filePro += '<li class="fl">' +
							'<a class="example-image-link" href="' + item + '" data-lightbox="example-1"><img class="example-image" src="' + item + '" alt="无数据"></a>' +
							'</li>';

					});
					$.each(wgimglist, function(index, item) {

						fileTb += '<li class="fl">' +
							'<a class="example-image-link" href="' + item + '" data-lightbox="example-1"><img class="example-image" src="' + item + '" alt="无数据"></a>' +
							'</li>';
					});
					$.each(docimgs, function(index, item) {
						fileRisk += '<li class="fl">' +
							'<a class="example-image-link" href="' + item + '" data-lightbox="example-1"><img class="example-image" src="' + item + '" alt="无数据"></a>' +
							'</li>';
					});

					$("#filePro").html(filePro);
					$("#fileTb").html(fileTb);
					$("#fileRisk").html(fileRisk);
					var lis = $("#fileList li");
					if(lis.length > 8) {
						$(".more_pic").show();
						lis.hide();
						lis.slice(0, 8).show();
					} else {
						$(".look_more_pic").hide();
					}
				} else if(proType == 2) { //供应链

					var fileList = data.commitments;
					var filePro = "",
						fileTb = "",
						fileRisk = "";
					$.each(fileList, function(index, item) {
						if(item.type == "5") {
							filePro += '<li class="fl">' +
								'<a class="example-image-link" href="' + item.url + '" data-lightbox="example-1"><img class="example-image" src="' + item.url + '" alt="无数据"></a>' +
								'</li>';

						}
						if(item.type == "1" || item.type == "2" || item.type == "3" || item.type == "4" || item.type == "6") {
							fileTb += '<li class="fl">' +
								'<a class="example-image-link" href="' + item.url + '" data-lightbox="example-1"><img class="example-image" src="' + item.url + '" alt="无数据"></a>' +
								'</li>';
						}
						if(item.type == "7") {
							fileRisk += '<li class="fl">' +
								'<a href="' + item.url + '" target="_blank">付款承诺书函</a>' + '</li>';
						}

					});
					$("#filePro").html(filePro);
					$("#fileTb").html(fileTb);
					$("#fileRisk").html(fileRisk);
					var lis = $("#fileList li");
					if(lis.length > 8) {
						$(".more_pic").show();
						lis.hide();
						lis.slice(0, 8).show();
					} else {
						$(".look_more_pic").hide();
					}
				}
				$("#filePro").html(filePro);
				$("#fileTb").html(fileTb);
				$("#fileRisk").html(fileRisk);
				var lis = $("#fileList li");
				if(lis.length > 8) {
					$(".more_pic").show();
					lis.hide();
					lis.slice(0, 8).show();

				} else {
					$(".more_pic").hide();
				}
			} else {
				console.log(json.data);
			}

		}
	});
}
var numPic = 8;
var numDuce = 0;
$(".look_more_pic").click(function() {
	_czc.push(['_trackEvent', '出借详情-风控情况', '点击', '查看更多']);
	var lis = $("#fileList li");
	numPic = numPic + 8;
	if(numDuce % 8 > 0) {
		$(".look_more_pic").hide();
	}
	numDuce = lis.length - numPic;
	lis = $("#fileList li").slice(0, numPic);

	lis.show();
});
//股东信息
function getZtmgLoanBasicInfo() {
	$.ajax({
		url: ctxpath + "/project/getZtmgLoanBasicInfo",
		type: 'post',
		dataType: 'json',
		data: {
			from: '1',
			projectid: projectId
		},
		success: function(json) {
			if(json.state == 0) {
				var data = json.data.shareholdersList;
				var htm = "";
				if(data != null && data.length > 0) {
					htm += "<li><b>股东类型</b><b>证件类型</b><b>股东名称</b><li>"
					$.each(data, function(index, item) {
						htm += '<li><b>' + item.shareholdersType + '</b><b>' + item.shareholdersCertType + '</b><b>' + item.shareholdersName + '</b></li>';
					});
					$("#shareholdersList").html(htm);
				} else {
					$("#shareholdersList").hide();
					$(".LoanBasicInfo_null").show();
				}

			} else {
				console.log(json);
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

//还款计划
function projectRepayPlan(pageNo, pageSize) {
	var project_repay_plan = $("#project_repay_plan");

	// 每次请求之前删除之前页面的缓存内容.
	project_repay_plan.empty();

	// 项目ID.
	if(projectId != null && projectId.toString().length > 1) {
		$.ajax({
			url: ctxpath + "/project/getProjectRepayPlanList",
			type: 'post',
			dataType: 'json',
			data: {
				from: '1',
				pageNo: pageNo,
				pageSize: pageSize,
				projectid: projectId
			},
			success: function(json) {
				// 查找成功.
				if(json.state == 0) {
					// --
					var content = '<tr><th>期数</th><th>还款日期</th><th>还款金额</th><th>还款状态</th><th></th></tr>';
					if(json.data.repayplanlist != null && json.data.repayplanlist.length > 0) {
						$.each(json.data.repayplanlist, function(index, item) {
							var planstate = '';
							// 还款状态，1：未还款，2：还款成功，3：还款失败.
							if(item.planstate == 1) {
								planstate = '未还款';
								content += '<tr>' +
									'<td>第' + item.repaysort + '期</td>' +
									'<td>' + item.repaydate + '</td>' +
									'<td>' + formatCurrency(item.amount) + '</td>' +
									'<td>' + planstate + '</td>' +
									'<td></td>' +
									'</tr>';
							}
							if(item.planstate == 2) {
								planstate = '已还款';
								content += '<tr class="cur">' +
									'<td>第' + item.repaysort + '期</td>' +
									'<td>' + item.repaydate + '</td>' +
									'<td>' + formatCurrency(item.amount) + '</td>' +
									'<td>' + planstate + '</td>' +
									'<td></td>' +
									'</tr>';
							}
							if(item.planstate == 3) {
								planstate = '还款失败';
								content += '<tr>' +
									'<td>第' + item.repaysort + '期</td>' +
									'<td>' + item.repaydate + '</td>' +
									'<td>' + formatCurrency(item.amount) + '</td>' +
									'<td>' + planstate + '</td>' +
									'<td></td>' +
									'</tr>';
							}
						});
						project_repay_plan.append(content);

					} else {
						project_repay_plan.append(content);
					}
				}

			}
		});
	}
}

//出借记录
function projectInvestList(pageNo, pageSize) {

	// 项目出借列表.
	var project_invest_list = $("#project_invest_list");

	// 每次请求之前删除之前页面的缓存内容.
	project_invest_list.empty();

	// 项目ID.
	if(projectId != null && projectId.toString().length > 1) {
		$.ajax({
			url: ctxpath + "/project/getProjectBidList",
			type: 'post',
			dataType: 'json',
			data: {
				from: '1',
				pageNo: pageNo,
				pageSize: pageSize,
				projectid: projectId
			},
			success: function(json) {
				// 查找成功.
				if(json.state == 0) {

					var content = '<li><span>序号</span><span>出借人</span><span>出借金额</span><span>出借时间</span></li>';
					if(json.data.bidlist != null && json.data.bidlist.length > 0) {
						$.each(json.data.bidlist, function(index, item) {

							content += '<li>' +
								'<span>' + (index + 1) + '</span>' +
								'<span>' + item.name + '</span>' +
								'<span>' + formatCurrency(item.amount) + '元</span>' +
								'<span>' + item.createdate + '</span>' +
								'</li>';

						});
						project_invest_list.append(content);
						// page bar.
						if(json.data.pageCount > 1) {
							$('#light_pagination').pagination({
								pages: json.data.pageCount,
								currentPage: json.data.pageNo, //当前页
								onPageClick: function(pageNo) {
									projectInvestList(pageNo, pageSize);
									_czc.push(['_trackEvent', '出借详情-出借记录', '点击', '页码']);
								},
								onInit: function() {
									$('.prev').removeClass('current');
									$('.next').removeClass('current');
								},
								cssStyle: 'light-theme'
							});
						} else {
							$("#light_pagination").hide();
						}
					} else {
						content += "<li><p>暂无出借记录</p></li>"
						project_invest_list.append(content);
						$("#light_pagination").hide();
					}
				}
			}
		});
	}
}

//出借记录
function investList(data, userName) {

	var investList = data.bidList;

	//登录未投资
	if(investList.length > 0) {
		if(token != null && token.trim().length > 0) {
			var userName2 = userName.substr(0, 3) + '****' + userName.substr(7);
			$.each(investList, function(index, invest) {
				if(userName2 == invest.userPhone) {
					$(".program_info_space").show();
					$(".invest_null").hide();
					return false;
				} else {
					$(".invest_null").show();
					$(".program_info_space").hide();

				}
			});
		} else {
			$(".invest_null").show();
			$(".program_info_space").remove();
		}

	}

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
	var loanDate = $("#loan_date").val();
	// 当前系统日期.
	var currentDate = nowDate();
	// 出借日期距离放款日期的天数.
	var days = calcDateDiff(currentDate, loanDate);
	return days;
}

/**
 * 根据用户输入金额显示对应应记利息
 */

function checkBlus() {

	getMsgEmpty();
	var rechargeMoney = $("#invest_input").val();
	var checkedValue = checkNum(rechargeMoney);
	$("#invest_input").val(checkedValue);
	showEarnints();

}

function showEarnints() {
	var amount = $("#invest_input").val();
	var span = $("#project_span").val();
	var rate = $("#project_rate").val();
	//	var days = calcDays();
	//	span = parseInt(span) + parseInt(days);
	var interest = amount * rate / 36500;
	interest = toDecimal2(interest);

	interest = toDecimal2(interest * parseFloat(span));

	$("#mask_expect").html(formatCurrency(interest));
}

$("#invest_btn").click(function() {

	$("#invest_input").removeClass("borderRed");
	var proState = $("#proState").val();
	if(proState != 3) {

		if($("#project_state").val() == "1") {
			getMsg("项目未发布");
			return;
		}
		// 校验token 是否存在，不存在去登录页面
		if(token == null || token.trim().length <= 0) {

			logout();
			return;

		}
		//判断是否绑卡
		if(bindCard != '2') { //未绑卡
			$(".mask_drop,.mask_bank").show();

			return;
		}
		//判断用户是否风险评测
		if(isTest == 0) { //未评测
			$(".mask_drop,.mask_risk").show();
			return;
		}

		// 看用户是否输入出借金额
		var amount = $("#invest_input").val();
		amount = amount.trim();
		var type = /^[0-9]*[1-9][0-9]*$/; // 正整数校验
		var re = new RegExp(type);

		if(amount == null || amount.trim().length <= 0) {

			getMsg("请输入出借金额");
			$("#invest_input").addClass("borderRed");
			return;
		}
		var projectId = $("#project_id").val();
		while(availableAmount.indexOf(",") > 0) {
			availableAmount = availableAmount.replace(",", "");
		}
		if(parseFloat(amount) > parseFloat(availableAmount)) {
			// 出借金额大于账户可用余额
			getMsg("账户可用余额不足");
			$("#invest_input").addClass("borderRed");
			return;
		}
		var project_available_amount = $("#project_balanceamount").val(); // 项目可出借金额
		var min_amount = $("#project_minamount").val(); // 1000 起投金额
		var max_amount = $("#project_maxamount").val(); // 500000 最大金额
		var step_amount = $("#project_stepamount").val(); // 100 递增金额
		var spot_amount = project_available_amount - amount; //小数点金额
		// 最后一次出借逻辑
		if(parseFloat(project_available_amount) < parseFloat(min_amount)) {
			if(parseFloat(amount) < parseFloat(project_available_amount)) {
				getMsg("所投金额小于剩余可投金额，请一次性输入剩余可投金额");
				$("#invest_input").addClass("borderRed");
				return;
			}
			if(parseFloat(amount) > parseFloat(project_available_amount)) {
				getMsg("所投金额大于剩余可投金额，请一次性输入剩余可投金额");
				$("#invest_input").addClass("borderRed");
				return;
			}
		}
		// 正常出借逻辑
		else {
			if(parseFloat(amount) < parseFloat(min_amount)) {
				getMsg("所投金额请不小于起投金额");
				$("#invest_input").addClass("borderRed");
				return;
			}
			if(parseFloat(amount) > parseFloat(project_available_amount)) {
				getMsg("输入金额请不大于项目剩余可投金额");
				$("#invest_input").addClass("borderRed");
				return;
			}

			if(parseFloat(amount) % parseFloat(step_amount) != 0 && parseFloat(amount) != parseFloat(project_available_amount)) {
				getMsg("请输入" + step_amount + "的整数倍金额");
				$("#invest_input").addClass("borderRed");
				return;
			}
			if(parseFloat(amount) > parseFloat(max_amount)) {
				getMsg("所投金额请不大于单笔最高出借金额");
				$("#invest_input").addClass("borderRed");
				return;
			}
			if(parseFloat(spot_amount) < parseFloat(100) && parseFloat(amount) != parseFloat(project_available_amount)) {
				$(".mask_drop,.mask_spot").show();
				$("#spot_min").html(parseFloat(100));
				var spotMax = parseInt(project_available_amount - 100);
				spotMax = parseInt(spotMax / 100);
				spotMax = spotMax * 100;
				$("#spot_max").html(spotMax);

				return;
			}
		}
		window.location.href = "invest_confirm.html?id=" + projectId + "&amount=" + amount;

	} else {
		$(".toast").show();
		setTimeout(function() {
			$(".toast").hide();
		}, 2000);
	}
	_czc.push(['_trackEvent', '出借详情-顶部右半部分', '点击', '立即加入按钮']);

});
/**
 * 显示用户出借金额可用抵用券列表
 * @param {Object} amount
 */

/**
 * 描述: 日期字符串转换成Time. <br>
 */
function stringToTime(str) {
	var f = str.split(' ', 2);
	var d = (f[0] ? f[0] : '').split('-', 3);
	var t = (f[1] ? f[1] : '').split(':', 3);
	return(new Date(parseInt(d[0], 10) || null, (parseInt(d[1], 10) || 1) - 1, parseInt(d[2], 10) || null, parseInt(t[0], 10) || null, parseInt(t[1], 10) || null, parseInt(t[2], 10) || null)).getTime();
}

//充值
function recharge() {
	_czc.push(['_trackEvent', '出借详情-顶部右半部分', '点击', '充值']);
	if(token != null || token != "") {
		if(bindCard == '2') {
			window.location.href = "account_recharge.html";
		} else {
			$(".mask_drop").show();
			$(".mask_bank").show();
		}
	} else {
		logout();
	}

}

function checkNum(value) {
	var str = value;
	var len1 = str.substr(0, 1);
	var len2 = str.substr(1, 1);

	//如果第一位是0，第二位不是点，就用数字把点替换掉
	if(str.length > 1 && len1 == 0 && len2 != '.') {
		str = str.substr(1, 1);
	}

	//第一位不能是.
	if(len1 == '.' || len1 == 0) {
		str = '';
	}
	//限制只能输入一个小数点
	if(str.indexOf(".") != -1) {
		var str_ = str.substr(str.indexOf(".") + 1);
		//限制只能输入一个小数点
		if(str_.indexOf(".") != -1) {
			str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
		}
	}

	return str;
}

/**
 * 描述: 当前日期距离满标日期的剩余天时分秒. <br>

 */
function toDays(index) {

	// 项目满标日期.
	var temp_countdowndate = $("#temp_countdowndate").val();
	var EndTime = new Date(temp_countdowndate);
	var NowTime = new Date();
	var t = EndTime.getTime() - NowTime.getTime();
	var d = 0;
	var h = 0;
	var m = 0;
	var s = 0;
	if(t >= 0) {
		d = Math.floor(t / 1000 / 60 / 60 / 24);
		h = Math.floor(t / 1000 / 60 / 60 % 24);
		m = Math.floor(t / 1000 / 60 % 60);
		s = Math.floor(t / 1000 % 60);
	}
	// 天.

	$("#invlNTtimeD").html(d);
	// 时.
	$("#invlNTtimeH").html(h);
	// 分.
	$("#invlNTtimeM").html(m);
	// 秒.
	$("#invlNTtimeS").html(s);
	if(t == 0 || t < 0) {
		window.location.reload();
	}
	return false;
}
/**
 * 格式化金额
 * @param {Object} num
 */
function formatCurrency(num) {
	num = num.toString().trim();
	if(isNaN(num))
		num = "0";
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(num * 100 + 0.50000000001);
	cents = num % 100;
	num = Math.floor(num / 100).toString();
	if(cents < 10)
		cents = "0" + cents;
	for(var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
		num = num.substring(0, num.length - (4 * i + 3)) + ',' +
		num.substring(num.length - (4 * i + 3));
	return(((sign) ? '' : '-') + num + '.' + cents);
}
$("#close_spot").click(function() {
	_czc.push(['_trackEvent', '出借详情-温馨提示弹窗', '点击', '取消、关闭']);
	$(".mask_drop,.mask_spot").hide();
	$("#invest_input").val("");
});
$("#submit_spot").click(function() {
	_czc.push(['_trackEvent', '出借详情-温馨提示弹窗', '点击', '已了解']);
	$(".mask_drop,.mask_spot").hide();
	var smAmountSpot = $("#project_balanceamount").val();
	$("#invest_input").val(smAmountSpot);
	getMsgEmpty();
});

//错误提示
function getMsg(str) {

	$("#error").css("visibility", "visible").html(str);
}
//清空错误提示
function getMsgEmpty() {
	$("#error").css("visibility", "hidden").html("");
}
//项目评级
$(".star_tip").click(function() {
	$(".mask_drop,.mask_project_rating").show();
});
$(".mask_project_rating .close").click(function() {
	_czc.push(['_trackEvent', '出借详情-项目介绍-评级说明', '点击', '关闭按钮、空白区']);
	$(".mask_drop,.mask_project_rating").hide();
});
/*项目详情*/
$(".program_tab li").click(function() {
	$(this).addClass("cur").siblings().removeClass("cur");
	$(".program_info_space .program_tab_con").eq($(this).index()).show().siblings().hide();
});
$(".close_mask_btn").click(function() {
	$(".mask_drop,.mask_fixed_wrap").hide();
});

//LoanBasicInfoBtn
$("#LoanBasicInfoBtn").click(function() {
	_czc.push(['_trackEvent', '出借详情-借款方信息', '点击', '股东信息查看']);
	$(".mask_drop,.mask_LoanBasicInfo").show();
});
$(".mask_LoanBasicInfo .close,.btn_loanbi").click(function() {
	_czc.push(['_trackEvent', '出借详情-借款方信息-股东信息', '点击', '已了解、关闭']);
	$(".mask_drop,.mask_LoanBasicInfo").hide();
});
/*开户*/
$(".mask_bank .close").click(function() {
	$(".mask_drop,.mask_bank").hide();
});
/*风险测评*/
$(".mask_risk .close").click(function() {
	$(".mask_drop,.mask_risk").hide();
});
/*出借温馨提示*/
$(".mask_spot .close").click(function() {
	$(".mask_drop,.mask_spot").hide();
});
$(".mask_drop").click(function() {
	$(".mask_drop,.mask_risk,.mask_project_rating,.mask_bank,.mask_LoanBasicInfo").hide();
});