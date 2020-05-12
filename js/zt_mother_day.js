jQuery.support.cors = true;


$(function(){
	if(token != null && token.trim().length > 0) {
		$.ajax({
		
	    url: ctxpath + "/activity/userSumInvest",
		type:"post",
		dataType:"json",
		data:{
			from: '1',
			token: token
		},
		success:function(result){
			
			var obj = result.data; //获取查出的数据
			if(result.state=="0"){
				$(".m_login").show();
				var amount=obj.sumAmount;
				$("#investAmount").html(amount);
				
				
			}
			else if(result.state=="4"){
				$(".m_login_no").show();
				$(".m_login_no").click(function(){
					mask_login();
				});
			}
		}
			
	
	  })	
	}else{
		$(".m_login_no").show();
		
	}
	
})
