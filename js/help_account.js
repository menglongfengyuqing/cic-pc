$(function() {
	getCoreCompany();

});
//核心企业
function getCoreCompany(){
	$.ajax({
		url: ctxpath + "/cms/getMiddlemenList",
		type: "post",
		dataType: "json",
		data: {
			from: 1,
			pageNo: 1,
			pageSize: 8
		},
		success: function(result) {

			

			if(result.state == "0") {
				var str = '';
				var middlemenList = result.data.middlemenList;
				var item;
				var itemAnnexFileUrl;
				//				console.log(result.data);
				for(var i = 0; i<middlemenList.length ; i++) {
					item = middlemenList[i];
					itemAnnexFileUrl = item.annexFile.url;
					if(itemAnnexFileUrl.length > 24){
						str+='<li class="fl"><a href="'+item.annexFile.remark+'" target="_blank"><img src="'+item.annexFile.url+'"></a></li>';
					}
				}

				$('#coreCompany').html(str);
			}
			
			if(result.state == "4") {
				logout();
			}
		}
	});
}
$(".account_tit").click(function() {
	$(this).toggleClass("cur");
	$(this).siblings(".account_answer").toggle();
});
$(".account_tab_li li").click(function() {
	$(this).addClass("cur").siblings().removeClass("cur");
	$(".account_group .account_one").eq($(this).index()).show().siblings().hide();
});

var name = getArgumentsByName("name");

switch(name) {
	case "password":
		$(".tab_password").addClass("cur").siblings().removeClass("cur");
		break;
	case "safe_control":
		$(".tab_safe_control").addClass("cur").siblings().removeClass("cur");
		break;
	case "bankcard":
		$(".tab_bankcard").addClass("cur").siblings().removeClass("cur");
		break;
	case "recharge":
		$(".tab_recharge").addClass("cur").siblings().removeClass("cur");
		break;
	case "widthdraw":
		$(".tab_withdraw").addClass("cur").siblings().removeClass("cur");
		break;
	case "coupon":
		$(".tab_coupon").addClass("cur").siblings().removeClass("cur");
		break;
	default:
		$(".tab_login").addClass("cur").siblings().removeClass("cur");
}