jQuery.support.cors = true;

$(function() {
    mediacoverageList(1,5);
});

function mediacoverageList(pageNo,pageSize){
		//媒体公告
		$.ajax({
		url: ctxpath + "/cms/getCmsListByType",
		type:"post",
		dataType:"json",
		data:{
			pageNo:pageNo,
			pageSize:pageSize,
			type:'3',
			from:'1'
		},
		success:function(result){
			if(result.state == "0"){
				var obj = result.data;
				var list = obj.cmsList;
				var htm = '<h3>媒体报道</h3>';
				$.each(list,function(index, value) {
					htm+='<div class="media_group">'
						+'<div class="media_group_l fl">'
						+'<img src="'+value.imgPath+'" />'
						+'</div>'
						+'<div class="media_group_r fl">'
						+'<a href="about_media_coverage_sub.html?id='+value.id+'" target="_blank">'
						+'<h6 class="font_size18">'+value.title+'</h6>'
						+'<div class="media_msg font_size16"><span class="fl">'+value.sources+'</span><span class="fr">'+value.sourcesDate+'</span></div>'
						+'<p class="font_size14 clear">'+value.head+'<span class="fr">查看更多>></span></p>'
						+'</a>'
						+'</div>'
						+'</div>';
					
				});
				if(result.data.pageCount>1){
					$('.pagination_holder').show();
					$('#light-pagination').pagination({
						pages: result.data.pageCount,
						currentPage:result.data.pageNo, //当前页
						onPageClick:function(pageNo){
							mediacoverageList(pageNo,pageSize);
						},
						onInit:function(){
							$('.prev').removeClass('current');
							$('.next').removeClass('current');
						},
						cssStyle: 'light-theme'
					});
				}else{
					$('.pagination_holder').hide();
				}
				
				$(".media_con").html(htm);
			}
		}
	});
}
