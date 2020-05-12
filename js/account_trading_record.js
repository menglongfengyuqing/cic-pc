/**
 * 个人中心，交易记录.
 */
var type = -1; // 默认交易类型（全部）
$(function() {
	// --
	if(token != null && token.trim().length > 0) {
		// 查找用户交易流水
		findTradeBatchDetailList(1, 10);
	} else {
		logout();
	}

	// 交易类型高亮展示
	$(".recording_tab li").click(function() {
		$(this).addClass("cur").siblings().removeClass("cur");
	});
});

/**
 * author: Mr.Roy <br>
 * description: 初始化交易类型 <br>
 * @param {Object} param 交易类型
 */
function initType(param) {
	type = param;
	findTradeBatchDetailList(1, 10);
	// console.log("交易类型：\t" + type);
}

//var pageNo = 1; // 页码
//var pageSize = 10; // 每页展示记录
/**
 * author: Mr.Roy <br>
 * description: 查找用户交易详情列表 <br>
 */
function findTradeBatchDetailList(pageNo, pageSize) {

	// console.log("pageNo:" + pageNo + "pageSize:" + pageSize);
	// 开始日期
	var beginDate = $("#begin").val();
	// console.log("开始日期：\t" + beginDate);
	// 结束日期
	var endDate = $("#end").val();
	// console.log("结束日期：\t" + endDate);
	// console.log("交易类型：\t" + type);
	// token非空判断
	if(token != null && token.trim().length > 0) {
		// 调用客户账户接口.
		$.ajax({
			url: ctxpath + "/trans/findTradeBatchDetailList",
			type: 'post',
			dataType: 'json',
			data: {
				token: token,
				pageNo: pageNo,
				pageSize: pageSize,
				from: '1', // PC端请求
				type: type,
				beginDate: beginDate,
				endDate: endDate
			},
			success: function(json) {
				// console.log(json);
				// 列表父元素
				var trading_ul = document.getElementById('trading_ul_id');
				// console.log("trading_ul\t" + trading_ul);

				// 清空父元素下的所有子元素，为后续赋值做准备
				var childs = trading_ul.childNodes; 
				for(var i = childs .length - 1; i >= 0; i--) {
				  trading_ul.removeChild(childs[i]);
				}

				// 列头
				var th_li = document.createElement("li");
				var span_1 = document.createElement("span");
				span_1.setAttribute("class", "fl");
				span_1.innerHTML = "交易时间";
				th_li.appendChild(span_1);
				var span_2 = document.createElement("span");
				span_2.setAttribute("class", "fl");
				span_2.innerHTML = "交易类型";
				th_li.appendChild(span_2);
				var span_3 = document.createElement("span");
				span_3.setAttribute("class", "fl");
				span_3.innerHTML = "交易金额(元)";
				th_li.appendChild(span_3);
				var span_4 = document.createElement("span");
				span_4.setAttribute("class", "fl");
				span_4.innerHTML = "账户余额(元)";
				th_li.appendChild(span_4);
				trading_ul.appendChild(th_li);

				// 数据请求成功
				if(json.state == '0') {
					// 交易列表
					if(json.data.translist != null && json.data.translist.length > 0) {
						// 消息隐藏
						$(".null_recording").hide();
						$.each(json.data.translist, function(index, item) {
							// 循环体
							var li = document.createElement("li");
							// 交易时间
							var em = document.createElement("em");
							em.setAttribute("class", "fl");
							em.innerHTML = item.trandDate;
							li.appendChild(em);
							// 交易类型
							var b_1 = document.createElement("b");
							b_1.setAttribute("class", "fl");
							if(item.transType == '3') { // 出借的几种业务处理
								if(item.inOutType == '1') { // 收入
									var remark = item.remark;
									remark = remark.substring(0, 2);
									if(remark == "流标") {
										b_1.innerHTML = "流标(" + item.projectSn + ")";
									} else {
										b_1.innerHTML = "退款(" + item.projectSn + ")";
									}
								} else if(item.inOutType == '2') { // 支出
									b_1.innerHTML = "出借(" + item.projectSn + ")";
								}
							} else if(item.transType == '4') {
								b_1.innerHTML = item.transTypeStr + "(" + item.projectSn + ")";
							} else if(item.transType == '5') {
								b_1.innerHTML = item.transTypeStr + "(" + item.projectSn + ")";
							} else {
								b_1.innerHTML = item.transTypeStr;
							}
							li.appendChild(b_1);
							
							// 交易金额
							var b_2 = document.createElement("b");
							if(item.inOutType == '1') {
								b_2.setAttribute("class", "fl in");
								b_2.innerHTML = "+" + item.transactionAmount;
							} else if (item.inOutType == '2') {
								b_2.setAttribute("class", "fl out");
								b_2.innerHTML = "-" + item.transactionAmount;								
							} else if (item.inOutType == '3'){ // 冻结
								b_2.setAttribute("class", "fl out");
								b_2.innerHTML = "" + item.transactionAmount;
							}
							li.appendChild(b_2);

							// 剩余金额
							var b_3 = document.createElement("b");
							b_3.setAttribute("class", "fl");
							b_3.innerHTML = item.surplusMoney;
							li.appendChild(b_3);
							trading_ul.appendChild(li);
						});
						
						if(json.data.last > 1) {
							// 展示 page bar.
							$('#light-pagination').show();
							// 进行 page bar 渲染.
							$('#light-pagination').pagination({
								pages: json.data.last,
								currentPage: json.data.pageNo, //当前页
								onPageClick: function(pageNumber) {
									findTradeBatchDetailList(pageNumber, pageSize);
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
						//type
						if(type=="-1"){//全部
							$(".null_recording").show().html("暂无记录～");
						}
						else if(type=="3"){//出借
							$(".null_recording").show().html("暂无出借记录，赶紧去出借吧～");
						}
						else if(type=="0"){//充值
							$(".null_recording").show().html("暂无充值记录，赶紧去充值吧～");
						}
						else if(type=="1"){//提现
							$(".null_recording").show().html("暂无提现记录～");
						}
						else if(type=="4"){//回款
							$(".null_recording").show().html("暂无回款记录～");
						}
						else if(type=="10"){//优惠券
							$(".null_recording").show().html("暂无优惠券记录～");
						}
						// 隐藏 page bar.
						$('#light-pagination').hide();
					}
				} else if (json.state == '4'){ // 系统超时
					window.location.href = "login.html";			
				}
				else{
					console.log(json.message);
				}
			}
		});
	} else {
		window.location.href = "login.html";
	}
}