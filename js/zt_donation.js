jQuery.support.cors = true;

$(function() {
	mediacoverageList();
});

function mediacoverageList() {
	//媒体公告
	$.ajax({
		url: ctxpath + "/volunteer/getVolunteerOfferList",
		type: "post",
		dataType: "json",
		data: {
			from: '1'
		},
		success: function(result) {
			if(result.state == "0") {
				var obj = result.data;
				var list = obj.list;
				var htm = "";

				$("#count").html("目前共累计捐款总额" + obj.totalAmount + "元");
				$.each(list, function(index, value) {
					htm = htm + "<li class='odd'>" +
						"<span class='active_span01 font_size20'>" + value.name + "</span>" +
						"<span class='active_span03 font_size20'>完成了1元捐款</span></li>";
				});

				$("#mayList").html(htm);
			}
		}
	});
}
var doscroll = function() {
	var $parent = $('.js-slide-list');
	var $first = $parent.find('li:first');
	var height = $first.height();
	$first.animate({
		marginTop: -height + 'px'
	}, 600, function() {
		$first.css('marginTop', 0).appendTo($parent);
	});
};
setInterval(function() {
	doscroll()
}, 1000);