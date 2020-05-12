jQuery.support.cors = true;

$(function() {
    educationList(1,5,null);
    educationList(1,5,25);
});

function educationList(pageNo,pageSize,label){
		//风险教育
		$.ajax({
		url: ctxpath + "/cms/getEducationListByType",
		type:"post",
		dataType:"json",
		data:{
			pageNo:pageNo,
			pageSize:pageSize,
			label:label,
			from:'1'
		},
		success:function(result){
			if(result.state == "0"){
				var obj = result.data;
				var list = obj.cmsList;
				console.log(result);
				if(label!=25){
					var htm = "";
					$.each(list,function(index, value) {
					   var date = value.sourcesDate;
					   if(date==""||date==null){
					   	date="";
					   }
					   else{
					   	date=value.sourcesDate;
					   }
						htm+='<div class="edu_group">'
						   +'<h4><a href="education_details.html?id='+value.id+'&orderSum='+value.orderSum+'" target="_blank">'+value.title+'</a></h4>'	
						   +'<h5><span>'+date+'</span></h5>'	
						   +'<p class="module line-clamp"><span>'+value.head+'</span></p>'	
						   +'</div>';
						
					});
					if(result.data.pageCount>0){
						$('.pagination_holder').show();
						$('#light-pagination').pagination({
							pages: result.data.pageCount,
							currentPage:result.data.pageNo, //当前页
							onPageClick:function(pageNo){
								educationList(pageNo,pageSize,null);
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
					//console.log(htm);
					$("#edu_list").html(htm);
				}
				//政策解读
				else if(label == 25){
					var htm_z = '<h3 class="edu_tit">政策解读</h3>';
					$.each(list,function(index, value) {
						htm_z+='<div class="edu_group">'
						   +'<h4><a href="education_details.html?id='+value.id+'&orderSum='+value.orderSum+'">'+value.title+'</a></h4>'	
						   +'<h5><span>'+value.sourcesDate+'</span></h5>'	
						   +'</div>';
					});
					//console.log(htm_z);
					$("#z_educationList").html(htm_z);
				}

			}
		}
	});
}
