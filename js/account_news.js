var pageNo = '1';
var pageSize = '10';
var state = '0';
var from = '1';

$(function() {
	if(token != null && token.trim().length > 0) {
		getMessage(state, pageNo, pageSize);
	} else {
		logout();
	}

});

function getMessage(state, pageNo, pageSize) {
	$.ajax({
		url: ctxpath + "/station/stationList",
		type: 'post',
		dataType: 'json',
		data: {
			from: from,
			token: token,
			state: state,
			pageNo: pageNo,
			pageSize: pageSize
		},
		success: function(json) {
			if(json.state == "4") {
				logout();
			}
			if(json.state == "0") {
				var str = "";
				var data = json.data;
				$('.news_con ul').html(str);
				var letters = data.letters;
				if(letters.length > 0 && letters != null) {
					$.each(letters, function(index, item) {

						if(item.state == "1") {
							str += '<li>'; //未读
						} else {
							str += '<li class="default">'; //已读
						}
						str+='<div class="news_li_tit">'+
							'<i></i>'+
							'<span>' + item.title + '</span>'+
							'<input type="hidden" value="'+item.id+'"/>'+
							'<em>' + item.sendTime + '</em>'+
							'</div>'+
							'<div class="news_li_con clear">'+ item.title + item.body + '</div>'+
							'</li>';

					});
					$('.news_con ul').html(str);

					if(json.data.lastPage > 1) {
						$('#light-pagination').show();
						$('#light-pagination').pagination({
							pages: json.data.lastPage,
							currentPage: json.data.pageNo, //当前页
							onPageClick: function(pageNo) {
								getMessage(state, pageNo, pageSize);
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
				}else{
					$(".news_null").show();
					$('#light-pagination').hide();
				}

				// 改变单个消息状态为已读
				$(".news_con li").click(function() {
					var letterId = $(this).find("input").val(); // ID
					$(this).addClass("default");
					$.ajax({
						url: ctxpath + "/station/letterInfo",
						type: "post",
						dataType: "json",
						data: {
							from: from,
							token: token,
							letterId: letterId
						},
						success: function(result) {
							if(result.state == "4") {
								logout();
							}
							if(result.state == "0") {
							}
						}
					});
				});
			}
			//消息单击事件
			$(".news_li_tit").click(function() {
				$(this).siblings(".news_li_con").toggle();
			});
		}
	});

	/**
	 * 一键已读
	 */
	$(".read_all").click(function() {

		if(token != null && token.trim().length > 0) {
			$.ajax({
				url: ctxpath + "/station/changeLetterState",
				type: 'post',
				dataType: 'json',
				data: {
					from: from,
					token: token
				},
				success: function(json) {
					if(json.state == "0") {
						$(".news_con li").addClass("default");
					} else {
						logout();
					}
				}
			});
		} else {
			logout();
		}
	});

}