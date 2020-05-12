jQuery.support.cors = true;
var pageNo = parseInt(1);
var pageSize = parseInt(6);
var bindCard = 1;
var investSafe;
var investSupply;
$(function() {
	if(token != null || token != "") {
		//获取用户信息
		getUserInfo();
		//获取用户投资安心投，供应链利息
		getUserInvestSafe();
		getUserAccount();
	} else {
		window.location.href = "login.html";
	}
});

//获取用户信息
function getUserInfo() {
	$.ajax({
		url: ctxpath + "/user/getUserInfoNew",
		type: 'post',
		dataType: 'json',
		data: {
			from: '1',
			token: token
		},
		success: function(result) {
	
			if(result.state == '0') {
				var user = result.data;
				var realName = user.realName;//真实姓名
				var phone = user.name;
				var phoneNum = phone.substr(0, 3) + '****' + phone.substr(7);//手机号
				var IdCard = user.IdCard;//身份证
				var cgbBindBankCard = user.cgbBindBankCard;//开通存管银行 1未开通 2已开通
				bindCard=cgbBindBankCard;
				var userType = user.userType;//风险测评类型
				var bindBankCardNo = user.bindBankCardNo.substr(-4);//银行卡号码
				var bankName = user.bankName;//银行名称
				if(user.avatarPath == "" || user.avatarPath == null) {//头像
				} else {
					$("#userImg").attr("src", user.avatarPath);
				}
				if(realName == "") {
					$("#username").html(phoneNum);
				} else {
					$("#username").html(realName);
				}
			if(user.certificateChecked == 1) {
				$("#dredgeManage").show();
				$("#dredgeCard").hide();				
			}else{
				$("#dredgeManage").hide();
				$("#dredgeCard").show();
			}	
				if(cgbBindBankCard == 1) {
					$(".mask_cgb,.mask_drop").show();
				} else if(cgbBindBankCard == 2) {
					$(".mask_cgb,.mask_drop").hide();
				}

				if(userType != "") {
					$("#userType").html(result.data.userType);
				} else {
					$("#userType").removeClass("cur").html("立即测评");
				}
				
				var userBindEmail = (user.bindEmail == 2);
				userBindBankCard = (user.cgbBindBankCard == 2);
				if(IdCard&&userBindEmail&&userBindBankCard){
					$("#safeLevel").html("高");
					$("#levelWidth").css("width","80%");
				}else if(IdCard || userBindEmail || userBindBankCard){
					$("#safeLevel").html("中");
					$("#levelWidth").css("width","50%");
				}else if(!(IdCard&&userBindEmail&&userBindBankCard)){
					$("#safeLevel").html("低");
					$("#levelWidth").css("width","30%");
				}
				

			} else if(result.state == '4') {
				logout();
			} else {
                console.log(result.message);
			}
		}
	});

}

//获取用户投资安心投，供应链信息
function getUserInvestSafe() {
	$.ajax({
		url: ctxpath + "/user/getMyBidsTotal",
		type: 'post',
		dataType: 'json',
		data: {
			from: '1',
			token: token
		},
		success: function(result) {
			if(result.state == '0') {
			   
				$("#investSafe").html(formatCurrency(result.aAmount) + "元");
				investSafe = result.aAmount;
				$("#investSupply").html(formatCurrency(result.gAmount) + "元");
				investSupply = result.gAmount;
				$("#sumSafe").html(formatCurrency(result.aInerest) + "元");
				$("#sumSupply").html(formatCurrency(result.gInerest) + "元");
                if(parseInt(investSupply)==0 &&parseInt(investSafe)==0){
                	$(".rate_cic").addClass("null");
                }
				// 路径配置

				require.config({

					paths: {

						'echarts': 'js/echarts',

						'echarts/chart/pie': 'js/echarts'

					}

				});

				// 使用

				require(

					[

						'echarts',

						'echarts/chart/pie' // 使用柱状图就加载bar模块，按需加载

					],

					function(ec) {

						// 基于准备好的dom，初始化echarts图表

						var myChart = ec.init(document.getElementById('main'));

						var option = {

							color: ["#00aeee", "#feb412"],

							series: [

								{

									type: 'pie',

									radius: '50%',

									center: ['50%', '50%'],

									data: [

										{
											value: investSafe / (investSafe + investSupply),
											name: '安心投',

										},

										{
											value: investSupply / (investSafe + investSupply),
											name: '供应链'
										}

									]

								}

							]

						};

						myChart.setOption(option);

					}

				);

			} 
			else if(result.state == '1'){
                	$(".rate_cic").addClass("null");
			}
			
			else {
				console.log(result.message);
			}
		}
	});
}

//获取用户账户信息
function getUserAccount() {
	// 用户账户中心 (账户信息 )
	$.ajax({
		url: ctxpath + "/user/getcgbUserAccount",
		type: "post",
		dataType: "json",
		data: {
			from: '1',
			token: token
		},
		success: function(json) {
			if(json.state == 0) {
			
				var data = json.data;
				var total_amount = formatCurrency(data.totalAmount);
				var available_amount = formatCurrency(data.availableAmount);
				var freeze_amount = formatCurrency(data.freezeAmount);
				var regular_due_interest = formatCurrency(data.regularDueInterest);
				// 账户总额.
				$("#total_amount").html(total_amount);
				// 可用余额.
				$("#available_amount").html(available_amount);
				// 冻结金额.
				$("#freeze_amount").html(freeze_amount);
				// 定期累计出借金额.
				var regularTotalAmount = data.regularTotalAmount;
				// 活期累计出借金额.
				var currentTotalAmount = data.currentTotalAmount;
				// 出借累计总额(定期+活期).
				var investTotalAmount = parseFloat(regularTotalAmount) + parseFloat(currentTotalAmount);
				$("#invest_total_amount").html(formatCurrency(investTotalAmount));
				// 出借累计总利息(定期+获取).
				$("#invest_total_interest").html(formatCurrency(json.data.regularTotalInterest));
				// 定期在投金额.
				var regularDuePrincipal = json.data.regularDuePrincipal;
				// 活期在投金额.
				var currentAmount = json.data.currentAmount;
				// 在投金额(定期+活期).
				var inTheInvestmentAmount = parseFloat(regularDuePrincipal) + parseFloat(currentAmount);
				var in_the_investment_amount = formatCurrency(inTheInvestmentAmount);
				$("#in_the_investment_amount").html(in_the_investment_amount);
				// 定期代收利息.
				$("#regular_due_interest").html(regular_due_interest);
				// 累计取现金额.
				$("#cash_amount").html(formatCurrency(json.data.cashAmount));
				// 累计充值金额.
				$("#recharge_amount").html(formatCurrency(json.data.rechargeAmount));
				
			}
			else{
				logout();
			}
		}
	});
}

//提现
function withdraw() {
	$("#withdraw").addClass("cur");
	$("#recharge").removeClass("cur");
	if(bindCard == '2') {
		window.location.href = "account_withdraw.html";
	} else {
		//存管银行tip
		$(".mask_drop,.mask_cgb").show();
	}
}
//充值
function recharge() {
	$("#withdraw").removeClass("cur");
	$("#recharge").addClass("cur");
	if(bindCard == '2') {//已绑银行卡
		window.location.href = "account_recharge.html";
	} else {
		$(".mask_drop,.mask_cgb").show();
	}
}
/*关闭弹框*/
$(".close_mask_btn").click(function() {
	$(".mask_drop,.mask_cgb").hide();
});

function imgError(image){  
 image.src="images/account/head.png";    
} 