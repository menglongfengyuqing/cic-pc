jQuery.support.cors = true;

$(function() {

	question_list();

});

// token.
//var token = $.cookie("token");
// 总题数
var questionNum = 0;

//测试题列表
function question_list() {
	$.ajax({
		url: ctxpath + "/question/getQuestionList",
		type: "post",
		dataType: "json",
		data: {
			token: token
		},
		success: function(result) {
			if(result.state == "0") {
				var obj = result.data;
				var list = obj.topicList;
				var htm = "";
				$.each(list, function(index, value) {
					var answerList = value.answerList;
					questionNum = questionNum + 1;
					var num = index + 1;
					htm = htm + "<div class='question'>" +
						"<div class='ques-title'>" + value.name + "</div>";

					$.each(answerList, function(index, answer) {


							htm = htm + '<div class="bar_one">' +
								"<label for='question1_A' class='radio-checked-image'>" + answer.name + "</label>" +
								"<input type='radio' name='question" + num + "' data-score='4' value='" + value.id + "--" + answer.id + "' >"+
								"</div>";

					});
					htm = htm + "</div>";

				});
				$("#risk-question").html(htm);
			}
		}
	});
}

/**
 * 提交测评
 */
function saveUserAnswer() {
	//判断每个问题是否已经选择
	var answer = "";
	for(i = 1; i <= questionNum; i++) {
		var val = $("input[name='question" + i + "']:checked").val();
		if(val == null) {
			getMsg("第" + i + "道题为必答题,请选择");
			return false;
		} else {
			answer = answer + val + ",";
		}
	}
	//提交测评
	$.ajax({
		url: ctxpath + "/question/saveUserAnswer",
		type: "post",
		dataType: "json",
		data: {
			token: token,
			answer: answer
		},
		success: function(result) {
			if(result.state == "0") {
				$("#score").html(result.score)
				$(".mask_risk").show();
				$(".mask_drop").show();	
			}
		}
	});

}
//错误提示
function getMsg(str) {

	$(".mask_investNo_tip").show().html(str);
	setTimeout(function() {
		$(".mask_investNo_tip").hide();
	}, 2000);
}
$("#sureBtn").click(function(){
	window.location.href = document.referrer;
});
$("#reStart,.mask_risk em").click(function(){
	window.location.reload();
});
