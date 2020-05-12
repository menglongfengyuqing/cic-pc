var orderId = getArgumentsByName("orderId");
var count = 15;
var curCount;
var InterValObj; //timer变量，控制时间
var statSecond=true;
/*项目详情*/
$(function() {
	projectSate();
	curCount = count;
	var stateIng = $("#stateIng").val();
	stateIng = parseInt(stateIng);
	if(stateIng == "1") { //成功

		window.clearInterval(InterValObj); //停止计时器
		$(".state_invest_msg").addClass("state_invest_msg_success");
		$("#projectSate").html("恭喜您出借成功!");
	} else if(stateIng == "2") {
		window.clearInterval(InterValObj); //停止计时器

		$(".state_invest_msg").addClass("state_invest_msg_fail");
		$("#projectSate").html($("#remark").val());
		


	}
	InterValObj = window.setInterval(function SetRemainTime() {
		if(curCount == 0) {
			window.clearInterval(InterValObj); //停止计时器
			$("#second").html("");
		} else if(curCount == 5) {
			var stateIng = $("#stateIng").val();

			if(stateIng == "0" || stateIng == "" || stateIng == null) {
				curCount--;
				projectSate(statSecond);
				$("#second").html("(" + curCount + "s)");
			} else if(stateIng == "1") { //成功

				window.clearInterval(InterValObj); //停止计时器
				$(".state_invest_msg").addClass("state_invest_msg_success");
				$("#projectSate").html("恭喜您出借成功!");

			} else if(stateIng == "2") {
				window.clearInterval(InterValObj); //停止计时器
				$(".state_invest_msg").addClass("state_invest_msg_fail");	
				$("#projectSate").html($("#remark").val());
			}
		} else {
			curCount--;
			$("#second").html("(" + curCount + "s)");
		}

	}, 1000);

});

function projectSate(statSecond) {
	$.ajax({
		url: ctxpath + "/newinvest/seachInvestResult",
		type: "post",
		dataType: "json",
		data: {
			orderId: orderId
		},
		success: function(result) {
			if(result.state == 0) {
				var data = result.data;
				$("#projectName").html(data.projectName+'(' + data.projectSn+')');
				$("#amount").html(data.amount + '元');
				if(data.state == "0") { //处理中
					$("#stateIng").val("0");
					if(statSecond){
						window.location.href="index.html";
					}
				} else if(data.state == "1") { //成功
					$(".state_invest_msg").addClass("state_invest_msg_success");
					$("#projectSate").html("恭喜您出借成功!");
					$("#stateIng").val("1");

				} else if(data.state == "2") { //失败

					$(".state_invest_msg").addClass("state_invest_msg_fail");

					$("#projectSate").html(data.remark);
 					$("#remark").val(data.remark);
					$("#stateIng").val("2");

				}

			} else if(result.state == 1) { //处理中
				//              window.location.href="index.html";
			}

		}
	});

}