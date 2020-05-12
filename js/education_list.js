jQuery.support.cors = true;
$(function() {
	var label = getArgumentsByName("label");
    educationList(1,4,label);
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
						htm+='<div class="edu_group">'
						   +'<h4><a href="education_details.html?id='+value.id+'&orderSum='+value.orderSum+'" target="_blank">'+value.title+'</a></h4>'	
						   +'<h5><span>'+value.sourcesDate+'</span></h5>'	
						   +'<p class="module line-clamp"><span>'+value.head+'</span></p>'	
						   +'</div>';
					});
					if(result.data.pageCount>1){
						$('.pagination_holder').show();
						$('#light-pagination').pagination({
							pages: result.data.pageCount,
							currentPage:result.data.pageNo, //当前页
							onPageClick:function(pageNo){
								educationList(pageNo,pageSize,label);
							},
							onInit:function(){
								$('.prev').removeClass('current');
								$('.next').removeClass('current');
							},
							cssStyle: 'light-theme'
						});
						$(".news_null").hide();
					}
					//console.log(htm);
					$("#edu_labelList").html(htm);
					if(htm==""){
						$('.pagination_holder').hide();
						
						$(".news_null").show();
					}
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
	var labelName;
	if(label == 1){
		labelName = '互联网金融';
	}else if(label == 2){
		labelName = 'P2P';
	}else if(label == 3){
		labelName = '出借';
	}else if(label == 4){
		labelName = '金融';
	}else if(label == 5){
		labelName = '互联网';
	}else if(label == 6){
		labelName = '监管';
	}else if(label == 7){
		labelName = '银行';
	}else if(label == 8){
		labelName = '融资';
	}else if(label == 9){
		labelName = '风险';
	}else if(label == 10){
		labelName = 'P2P平台';
	}else if(label == 11){
		labelName = '网贷';
	}else if(label == 12){
		labelName = '资金';
	}else if(label == 13){
		labelName = '风险提示';
	}else if(label == 14){
		labelName = '理财';
	}else if(label == 15){
		labelName = '禁止性行为';
	}else if(label == 16){
		labelName = '法律法规';
	}else if(label == 17){
		labelName = '监管政策';
	}else if(label == 18){
		labelName = '小额分散';
	}else if(label == 19){
		labelName = '数据';
	}else if(label == 20){
		labelName = '企业';
	}else if(label == 21){
		labelName = '风控';
	}else if(label == 22){
		labelName = '大数据';
	}else if(label == 23){
		labelName = '贷款';
	}else if(label == 24){
		labelName = '网贷平台';
	}
	$("#edu_title").html(labelName);
	
}
