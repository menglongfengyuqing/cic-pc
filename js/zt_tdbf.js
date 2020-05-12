jQuery.support.cors = true;


$(function(){
	ActiveBoteList()
	
})
function ActiveBoteList(){
	console.log(token);
	$.ajax({
		
	    url: ctxpath + "/activity/dragonBoatSource",
		type:"post",
		dataType:"json",
		data:{
			from: '1',
			token: token
		},
		success:function(result){
			console.log(result.data);
			console.log(result.state);
			var obj = result.data; //获取查出的数据
			if(result.state=="4"){
				$(".tbdf_msg_prize").hide();
			}
			if(result.state=="0"){
				
				$(".tdbf_login").hide();
				$(".tbdf_msg_prize").show();
				$("#userCount").html(obj.inviteFriends);
				var str="";
				var inList=obj.investmentParentList;
				if(null != inList){
					$.each(inList, function(index, item) {
					str+='<li class="odd"> <span class="active_span01 font_size20">'+item.registtime+'</span><span class="active_span03 font_size20">'+item.name+'</span></li>';
					});					
				}
				$("#mayList").html(str);
				$("#invList1").html(obj.inviteFriends+"人")
				$("#invList2").html(formatCurrency(obj.bidTotalAmount)+"元");
				$("#invList3").html(formatCurrency(obj.brokerage)+"元");
				$("#invList4").html(obj.userScore+"分");
			}
		}
			
	
	})
}
