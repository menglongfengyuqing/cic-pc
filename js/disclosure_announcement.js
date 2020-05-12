jQuery.support.cors = true;

$(function() {
    proclamationList(1,6);
});

function proclamationList(pageNo,pageSize){
			//平台公告
		$.ajax({
		url: ctxpath + "/cms/getCmsListByType",
		type:"post",
		dataType:"json",
		data:{
			pageNo:pageNo,
			pageSize:pageSize,
			type:'2',
			from:'1'
		},
		success:function(result){
			if(result.state == "0"){
				var obj = result.data;
				var list = obj.cmsList;
				var htm = "";
				$.each(list,function(index, value) {
					htm+='<div class="announcement_group">'
						+'<a href="information_announcement_sub.html?id='+value.id+'" target="_blank">'
						+'<span class="fl">'+value.title+'</span>'
						+'<span class="fr">'+value.createDate+'</span>'
						+'</a>'
						+'</div>';
				});
				if(result.data.pageCount>1){
					$('#light-pagination').pagination({
						pages: result.data.pageCount,
						currentPage:result.data.pageNo, //当前页
						onPageClick:function(pageNo){
							proclamationList(pageNo,pageSize);
						},
						onInit:function(){
							$('.prev').removeClass('current');
							$('.next').removeClass('current');
						},
						cssStyle: 'light-theme'
					});
				}
				$(".media_con").html(htm);
			}
		}
	});
}


