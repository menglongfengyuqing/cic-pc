$(function() {
	var date = new Date;
	var year = date.getFullYear();
	getRepayPlan(year);

});

function getRepayPlan(year) {
	$.ajax({
		url: ctxpath + "/user/getUserInterestCount",
		type: "post",
		dataType: "json",
		data: {
			from: '1',
			token: token
		},
		success: function(result) {

			if(result.state == '0') {
				var data = result.data;

				if(data != null && data.length > 0) {
					var dataArr = {};
					var str = "";
					//							str.empty();
					str = '<tr><th>时间</th><th>未回款金额</th></tr>';
					$.each(data, function(index, item) {
						if(item[0].substr(0, 4) == year) {
							dataArr[index] = item;
						}
						//								dataArr[index] = item;

					});
					if(dataArr != null) {
						$.each(dataArr, function(index, item) {
							if(index % 2 == 0) {
								str += '<tr class="odd">' +
									'<td>' + item[0] + '</td>' +
									'<td>' + item[1] + '</td>' +
									'</tr>';
							} else {
								str += '<tr>' +
									'<td>' + item[0] + '</td>' +
									'<td>' + item[1] + '</td>' +
									'</tr>';
							}

						});
					}
					$("#repayPlan").html(str);

				} else {
					$(".news_null").show();
				}
			}
		}
	});
}
/*年 左右筛选*/
var date = new Date;
var year = date.getFullYear();
$(".payment_year").html(year + "年");
$(".payment_data_left").click(function() {
	year--;
	$(".payment_year").html(year + "年");
	getRepayPlan(year);
});
$(".payment_data_right").click(function() {
	year++;
	$(".payment_year").html(year + "年");
	getRepayPlan(year);
});