jQuery.support.cors = true;
$(function() {
	var Id = getArgumentsByName("id");
    detail(Id);
//  mediacoverageList(1,5);
});

function detail(Id){
		//媒体,公告详情
		$.ajax({
		url: ctxpath + "/cms/getCmsNoticeById",
		type: "post",
		dataType: "json",
		data:{
			noticeId: Id,
			from: '1'
		},
		success:function(result){
			if(result.state == "0"){
				var obj = result.data;
				var htm = "";
				htm+='<div class="media_top">'
					+'<h3>'+obj.title+'</h3>'
					+'<div class="media_sub_msg">媒体来源：'+obj.sources+'&nbsp;&nbsp;'+obj.createDate+'</div>'
					+'</div>'
					+'<div class="media_msg_con">'
					+'<!--媒体报道内容区域-->'
					+'<p>'+obj.text+'</p>'
					+'</div>';
                $(".media_con").html(htm);
			}
		}
	});
}