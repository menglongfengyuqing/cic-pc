jQuery.support.cors = true;

$(function(){
	
	// 账户总览
	$.ajax({
		url: ctxpath + "/user/getcgbUserAccount ",
		type:"post",
		dataType:"json",
		data:{
			from: '1',
			token: token
		},
		success:function(result){
			if(result.state==0){
			var account = result.data;
//			$(".home_page_property_l span").html( formatCurrency(account.totalAmount) );
			$("#availableAmount").html( formatCurrency(account.availableAmount) );
			$("#freezeAmount").html( formatCurrency(account.freezeAmount) );
			$("#regularDuePrincipal").html( formatCurrency(account.regularDuePrincipal) );
			$("#regularDueInterest").html( formatCurrency(account.regularDueInterest) );
			$("#regularTotalAmount").html( formatCurrency(account.regularTotalAmount) );
			$("#regularTotalInterest").html( formatCurrency(account.regularTotalInterest) );
			}

		}
	});
});
