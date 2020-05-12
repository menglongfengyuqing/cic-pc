/**
 * 个人中心，我的出借.
 */
// 标的流转状态
var projectState = -1;
// 标的产品类型
var projectProductType = -1;
$(function() {
	// --
	if(token != null && token.trim().length > 0) {
		// 查找我的出借列表
		findMyInvestList(1, 10);
	} else {
		window.location.href = "login.html";
	}

	// 标的产品类型高亮展示
	$(".home_r_tab li").click(function() {
		$(this).addClass("cur").siblings().removeClass("cur");
	});
	// 标的流转状态高亮展示
	$(".home_invest_tab li").click(function() {
		$(this).addClass("cur").siblings().removeClass("cur");
	});
	// 个人出借记录还款计划浮层隐藏
	$(".close_mask").click(function() {
		$(".reimbursement_plan,.mask_drop").hide();
	});
});

/**
 * author: Mr.Roy <br>
 * description: 查找出借还款计划根据出借记录ID. <br>
 * @param {Object} investId 出借记录ID
 */
function findRepayPlansByInvestId(investId) {

	console.log("bidId:\t" + investId);

	$.ajax({
		url: ctxpath + "/user/getUserInterestList",
		type: 'post',
		dataType: 'json',
		data: {
			from: '1',
			token: token,
			investId: investId
		},
		success: function(json) {
			if(json.state == 0) {

				// 出借记录还款计划浮层展示
				$(".reimbursement_plan,.mask_drop").show();

				// 列表父元素
				var invest_repay_plans_ul = document.getElementById('invest_repay_plans_ul');
				// 清空父元素下的所有子元素，为后续赋值做准备
				var childs = invest_repay_plans_ul.childNodes;
				for(var i = childs.length - 1; i >= 0; i--) {  
					invest_repay_plans_ul.removeChild(childs[i]);
				}

				var plans = json.data.userPlanList;
				if(plans != null && plans.length > 0) {
					$.each(plans, function(index, item) {
						var th_li = document.createElement("li");
						// 状态
						if("2" == item.state) { // 未还款
							var span = document.createElement("span");
							span.setAttribute("class", "cur");
							span.innerHTML = "未还款";
							th_li.appendChild(span);
						} else if("3" == item.state) { // 正常还款
							var span = document.createElement("span");
							span.setAttribute("class", "cur");
							span.innerHTML = "正常还款";
							th_li.appendChild(span);
						}
						// 时间
						var i = document.createElement("i");
						i.innerHTML = item.repaymentDate;
						th_li.appendChild(i);
						// 金额
						var div = document.createElement("div");
						div.setAttribute("class", "fr");
						div.innerHTML = formatCurrency(item.amount);
						if(item.principal == "1") { // 本金
							var b = document.createElement("b");
							b.innerHTML = "本金";
							div.appendChild(b);
						} else if(item.principal == "2") { // 利息
							var b = document.createElement("b");
							b.innerHTML = "利息";
							div.appendChild(b);
						}
						th_li.appendChild(div);
						invest_repay_plans_ul.appendChild(th_li);
					});
				} else {
					$(".mask_investNo_tip").html("暂无回款计划").show();
					setTimeout(function() {
						$(".mask_investNo_tip").hide();
					}, 2000);
					$(".reimbursement_plan,.mask_drop").hide();
				}
			} else if(json.state==4){
				logout();
			}
			else{
				console.log(json.message);
			}
		}
	});
}

/**
 * author: Mr.Roy <br>
 * description: 募集中还款计划查看时消息提示. <br>
 */
function candle() {
	$(".mask_investNo_tip").html("满标后可查看").show();
	setTimeout(function() {
		$(".mask_investNo_tip").hide();
	}, 2000);
}

/**
 * author: Mr.Roy <br>
 * description: 初始化标的流转状态 <br>
 * @param {Object} param 标的流转状态
 */
function initProjectState(param) {
	projectState = param;
	findMyInvestList(1, 10);
	// console.log("标的流转状态：\t" + projectState);
}

/**
 * author: Mr.Roy <br>
 * description: 初始化标的产品类型 <br>
 * @param {Object} param 标的产品类型
 */
function initProjectProductType(param) {
	projectProductType = param;
	findMyInvestList(1, 10);
	// console.log("标的产品类型：\t" + projectProductType);
}

/**
 * author: Mr.Roy <br>
 * description: 查找我的出借清单. <br>
 * @param {Object} pageNo 当前页码
 * @param {Object} pageSize 当前页面大小
 */
function findMyInvestList(pageNo, pageSize) {

	//	console.log("token：\t" + token + "\n");
	//	console.log("pageNo：\t" + pageNo + "\n");
	//	console.log("pageSize：\t" + pageSize + "\n");
	//	console.log("标的流转状态：\t" + projectState + "\n");
	//	console.log("标的产品类型：\t" + projectProductType + "\n");
	// token非空判断
	if(token != null && token.trim().length > 0) {
		// 我的出借.
		$.ajax({
			url: ctxpath + "/user/findMyInvestList",
			type: 'post',
			dataType: 'json',
			data: {
				token: token,
				pageNo: pageNo,
				pageSize: pageSize,
				from: '1', // PC端请求
				projectState: projectState,
				projectProductType: projectProductType
			},
			success: function(json) {
				// console.log(json);
				// 列表父元素
				var invest_ul = document.getElementById('invest_ul_id');
				// console.log("invest_ul\t" + invest_ul);
				// 清空父元素下的所有子元素，为后续赋值做准备
				var childs = invest_ul.childNodes;
				for(var i = childs.length - 1; i >= 0; i--) {  
					invest_ul.removeChild(childs[i]);
				}
				// 列头
				var th_li = document.createElement("li");
				var span_1 = document.createElement("span");
				span_1.setAttribute("class", "fl");
				span_1.innerHTML = "项目编号";
				th_li.appendChild(span_1);
				var span_2 = document.createElement("span");
				span_2.setAttribute("class", "fl");
				span_2.innerHTML = "借款期限/年化利率";
				th_li.appendChild(span_2);
				var span_3 = document.createElement("span");
				span_3.setAttribute("class", "fl");
				span_3.innerHTML = "出借金额(元)";
				th_li.appendChild(span_3);
				var span_4 = document.createElement("span");
				span_4.setAttribute("class", "fl");
				span_4.innerHTML = "出借时间";
				th_li.appendChild(span_4);
				var span_5 = document.createElement("span");
				span_5.setAttribute("class", "fl");
				span_5.innerHTML = "项目合同";
				th_li.appendChild(span_5);
				var span_6 = document.createElement("span");
				span_6.setAttribute("class", "fl");
				span_6.innerHTML = "还款计划";
				th_li.appendChild(span_6);
				invest_ul.appendChild(th_li);
				// 数据请求成功
				if(json.state == '0') {
					// 交易列表
					if(json.data.bidList != null && json.data.bidList.length > 0) {
						// 消息隐藏
						$(".null_recording").hide();
						$.each(json.data.bidList, function(index, item) {
							// 循环体
							var li = document.createElement("li");
							// 项目编号
							var a_1 = document.createElement("a");
							a_1.setAttribute("href", "invest_details.html?id=" + item.projectId);
							a_1.setAttribute("target", "_blank");
							a_1.setAttribute("class", "fl");
							a_1.innerHTML = item.projectSn;
							li.appendChild(a_1);
							// 借款期限/年化利率
							var b_1 = document.createElement("b");
							b_1.setAttribute("class", "fl");
							b_1.innerHTML = item.projectSpan + "天/" + item.projectRate + "%";
							li.appendChild(b_1);
							// 出借金额(元)
							var b_2 = document.createElement("b");
							b_2.setAttribute("class", "fl");
							b_2.innerHTML = item.bidAmount;
							li.appendChild(b_2);
							// 出借时间
							var b_3 = document.createElement("b");
							b_3.setAttribute("class", "fl");
							b_3.innerHTML = item.bidDate;
							li.appendChild(b_3);

							if("4" == item.projectState) {
								// 项目合同
								var a_2 = document.createElement("a");
								a_2.setAttribute("href", "javascript:;");
								a_2.setAttribute("onclick", "candle();");

								a_2.setAttribute("class", "fl");
								a_2.innerHTML = "查看";
								li.appendChild(a_2);
								// 还款计划
								var em = document.createElement("em");
								em.setAttribute("class", "fl");
								em.setAttribute("onclick", "candle();");
								em.innerHTML = "查看";
								li.appendChild(em);
								invest_ul.appendChild(li);
							} else {
								// 项目合同
								var a_2 = document.createElement("a");
								// http://cicmorgan.com/upload/pdf/201910/3246484b66e749778e93e18fe07c42ae.pdf
								var _invest_file_PdfPath = item.bidSignature;
								_invest_file_PdfPath = _invest_file_PdfPath.replace(/http:\/\/cicmorgan/g, "https://www.cicmorgan");
								a_2.setAttribute("href", _invest_file_PdfPath);
								a_2.setAttribute("target", "_blank");
								a_2.setAttribute("class", "fl");
								a_2.innerHTML = "查看";
								li.appendChild(a_2);
								// 还款计划
								var em = document.createElement("em");
								em.setAttribute("class", "fl");
								// 传参时,需要进行单双引号转义
								em.setAttribute("onclick", "findRepayPlansByInvestId(\'" + item.bidId + "\');");
								em.innerHTML = "查看";
								li.appendChild(em);
								invest_ul.appendChild(li);
							}
						});

						if(json.data.pageCount > 1) {
							// 展示 page bar.
							$('#light-pagination').show();
							// 进行 page bar 渲染.
							$('#light-pagination').pagination({
								pages: json.data.pageCount,
								currentPage: json.data.pageNo, //当前页
								onPageClick: function(pageNumber) {
									findMyInvestList(pageNumber, pageSize);
								},
								onInit: function() {
									$('.prev').removeClass('current');
									$('.next').removeClass('current');
								},
								cssStyle: 'light-theme'
							});
						} else {
							// 隐藏 page bar.
							$('#light-pagination').hide();
						}
					} else {
						// 展示提示消息.
						$(".null_recording").show();
						// 隐藏 page bar.
						$('#light-pagination').hide();
					}
				} else {
					logout();
				}
			}
		});
	} else {
		logout();
	}
}
