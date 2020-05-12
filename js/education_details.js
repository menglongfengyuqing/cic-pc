jQuery.support.cors = true;
$(function() {
	var Id = getArgumentsByName("id");
	detail(Id);
	educationList(1, 5, 25);
});

function detail(Id) {
	//出借教育详情
	$.ajax({
		url: ctxpath + "/cms/getCmsNoticeById",
		type: "post",
		dataType: "json",
		data: {
			noticeId: Id,
			from: '1'
		},
		success: function(result) {
			if(result.state == "0") {
				var obj = result.data;
				var htm = "";
				var date = obj.sourcesDate;
				if(date == "" || date == null) {
					date = "";
				} else {
					date = obj.sourcesDate;
				}
				htm += '<h4>' + obj.title + '</h4>' +
					'<h5><span>' + obj.sources + '</span><span>' + date + '</span></h5>' +
					'<p class="module line-clamp">' + obj.text + '</p>';
				$("#edu_detail").html(htm);
				$("#newsTitle").html(obj.title);
				$("#btmTitle").html(obj.title);
			}
		}
	});
}

function educationList(pageNo, pageSize, label) {
	//风险教育
	$.ajax({
		url: ctxpath + "/cms/getEducationListByType",
		type: "post",
		dataType: "json",
		data: {
			pageNo: pageNo,
			pageSize: pageSize,
			label: label,
			from: '1'
		},
		success: function(result) {
			if(result.state == "0") {
				var obj = result.data;
				var list = obj.cmsList;
				console.log(result);
				var htm = '<h3 class="edu_tit">政策解读</h3>';
				$.each(list, function(index, value) {
					htm += '<div class="edu_group">' +
						'<h4><a href="education_details.html?id=' + value.id + '&orderSum=' + value.orderSum + '" target="_blank">' + value.title + '</a></h4>' +
						'<h5><span>' + value.sourcesDate + '</span></h5>' +
						'</div>';

				});
				//console.log(htm);
				$("#zedu_List").html(htm);
			}
		}
	});
}

function getLast() {
	var orderSum = getArgumentsByName("orderSum");
	//上一篇
	$.ajax({
		url: ctxpath + "/cms/getEducationLast",
		type: "post",
		dataType: "json",
		data: {
			orderSum: orderSum,
			from: '1'
		},
		success: function(result) {
			if(result.state == "0") {
				var id = result.data.id;
				console.log(id);
				window.location.href = "education_details.html?id=" + id + "&orderSum=" + result.data.orderSum;
			} else {
				alert(result.message);
			}
		}
	});
}

function getNext() {
	var orderSum = getArgumentsByName("orderSum");
	//下一篇
	$.ajax({
		url: ctxpath + "/cms/getEducationNext",
		type: "post",
		dataType: "json",
		data: {
			orderSum: orderSum,
			from: '1'
		},
		success: function(result) {
			if(result.state == "0") {
				var id = result.data.id;
				console.log(id);
				window.location.href = "education_details.html?id=" + id + "&orderSum=" + result.data.orderSum;
			} else {
				alert(result.message);
			}
		}
	});
}