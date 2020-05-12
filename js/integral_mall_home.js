var pageNo = '1';
var pageSize = '12';
var from = '2';
var orderByType = "";
var needAbout = "";

$(function() {
	//获取用户积分
	getUserBouns();
	getAwardInfoList(pageNo, pageSize);
	if(token != null && token.trim().length > 0) {
		$("#score_game").attr("href", "integral_mall_game.html");
		$("#score_change").attr("href", "integral_mall_win.html");
		$("#myPoints").show();
	} else {
		$("#score_game").attr("href", "login.html");
		$("#score_change").attr("href", "login.html");
		$("#myPoints").hide();
	}
});

// 获得用户积分值
function getUserBouns() {
	$.ajax({
		url: ctxpath + "/bouns/userBouns",
		type: 'post',
		dataType: 'json',
		data: {
			from: "1",
			token: token
		},
		success: function(result) {
			if(result.state == '0') {
				$("#myPoints").html("我的积分："+ result.data.score+'<i></i>').click(function () {
					window.location.href="integral_mall_points.html";
				});
			}
		}
	});
}

function getAwardInfoList(pageNo, pageSize) {
	$.ajax({
		url: ctxpath + "/awardInfo/getAwardInfoListForPC",
		type: "post",
		dataType: "json",
		data: {
			from: from,
			pageNo: pageNo,
			pageSize: pageSize,
			isLottery: '2',
			orderByType: orderByType,
			needAbout: needAbout
		},
		success: function(result) {

			if(result.state == "0") {
				var str = "";
				var awardInfoList = result.data.awardlist;
				console.log(result.data);

				$.each(awardInfoList, function(index, item) {
					str += '<li class="fl">' +
						'<a href="integral_mall_product.html?id=' + item.awardId + '" onclick="_czc.push([\'_trackEvent\', \'积分商城商品列表\', \'点击\', \'商品模块\'])">'+
						'<dl>' +
						'<dt><img src="' + item.imgWeb + '"></dt>' +
						'<dd>' + item.name + '</dd>' +
						'<dd>' + item.needAmount + '<span class="font_size14">积分</span></dd>' +
						
						'</dl>' +
						'</a>' +
						'</li>';

				})
				$('#integral_mall_list').html(str);

				//分页
				if(result.data.pageCount > 1) {
					$('#light-pagination').show();
					$('#light-pagination').pagination({
						pages: result.data.pageCount,
						currentPage: result.data.pageNo, //当前页
						onPageClick: function(pageNo) {
							getAwardInfoList(pageNo, pageSize);
						},
						onInit: function() {
							$('.prev').removeClass('current');
							$('.next').removeClass('current');
						},
						cssStyle: 'light-theme'
					});
				}else{
					$('#light-pagination').hide();
				}
			}
		}
	});
}